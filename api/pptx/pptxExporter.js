const fs = require('fs');
const decompress = require('decompress');
const archiver = require('archiver');
const rimraf = require('rimraf');

exports.PPTXExporter = class PPTXExporter { 
    constructor() {
        this.setupPromise = this.setup();
    }

    async setup() {
        this.folderName = "tmp_" + new Date().toISOString() + Math.random();
        let folderName = this.folderName;
        folderName = folderName.replace(/\./g, "-");
        folderName = folderName.replace(/:/g, "-");

        await decompress('docs/pptx-default.zip', folderName);

        this.slideIds = "";
        this.slideRels = "";
        this.slideContentTypes = "";
        this.maxId = 1;
    }

    async addSong(songName, verses) {
        await this.setupPromise;
        let titleSlideContents = fs.readFileSync('docs/pptx-title-slide.xml').toString();
        let verseSlideContents = fs.readFileSync('docs/pptx-word-slide.xml').toString();
        let defaultParagraph = fs.readFileSync('docs/pptx-paragraph.xml').toString();
        let slideRel = fs.readFileSync('docs/pptx-slide-rel.xml').toString();
        let presentationSlideId = fs.readFileSync('docs/pptx-presentation-sldid.xml').toString();
        let presentationSlideRel = fs.readFileSync('docs/pptx-presentation-slide-rel.xml').toString();

        let contentTypesSlide = fs.readFileSync('docs/pptx-content-types-slide.xml').toString();

        verses.forEach((verse, i) => {
            let paragraphs = "";
            let slideContents = verseSlideContents;
            let slideId = this.maxId;
            this.maxId++;

            if(i === 0) {
                slideContents = titleSlideContents.replace("%TITLE%", songName);
            }
            
            verse.text.split("\n").forEach(line => {
                if(line !== "") {
                    paragraphs += defaultParagraph.replace("%WORD%", line);
                }
            });
            let slide = slideContents.replace("%PARAGRAPHS%", paragraphs);

            this.slideIds += presentationSlideId.replace(/%ID_NUM%/g, slideId);
            this.slideRels += presentationSlideRel.replace(/%ID_NUM%/g, slideId);
            this.slideContentTypes += contentTypesSlide.replace(/%ID_NUM%/g, slideId);

            fs.writeFileSync(folderName + "/ppt/slides/_rels/slide" + slideId + ".xml.rels", slideRel);
            fs.writeFileSync(folderName + "/ppt/slides/slide" + slideId + ".xml", slide);
        });
    }

    async exportPPTX(response) {
        await this.setupPromise;
        let presentationRels = fs.readFileSync('docs/pptx-presentation-rels.xml').toString();
        let presentation = fs.readFileSync('docs/pptx-presentation.xml').toString();

        let contentTypes = fs.readFileSync('docs/pptx-content-types.xml').toString();

        let fullPresentationRels = presentationRels.replace("%SLIDE_RELATIONSHIPS%", this.slideRels);
        let fullPresentation = presentation.replace("%SLIDE_IDS%", this.slideIds);
        let fullContentTypes = contentTypes.replace("%SLIDE_CONTENT_TYPES%", this.slideContentTypes);

        fs.writeFileSync(folderName + "/ppt/_rels/presentation.xml.rels", fullPresentationRels);
        fs.writeFileSync(folderName + "/ppt/presentation.xml", fullPresentation);
        fs.writeFileSync(folderName + "/[Content_Types].xml", fullContentTypes);

        response.on("finish", () => {
            rimraf(folderName, () => {}); // Remove directory
        });

        var archive = archiver('zip');
        archive.pipe(response);
        archive.directory(folderName, '');
        archive.finalize();

    }
    
}
