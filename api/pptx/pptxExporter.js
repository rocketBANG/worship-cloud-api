const fs = require('fs');
const decompress = require('decompress');
const archiver = require('archiver');
const rimraf = require('rimraf');

exports.PPTXExporter = class PPTXExporter { 
    async exportPPTX(songName, verses, response) {
        let folderName = "tmp_" + new Date().toISOString() + Math.random();
        folderName = folderName.replace(/\./g, "-");
        folderName = folderName.replace(/:/g, "-");

        let titleSlideContents = fs.readFileSync('docs/pptx-title-slide.xml').toString();
        let verseSlideContents = fs.readFileSync('docs/pptx-word-slide.xml').toString();
        let defaultParagraph = fs.readFileSync('docs/pptx-paragraph.xml').toString();
        let slideRel = fs.readFileSync('docs/pptx-slide-rel.xml').toString();
        let presentationSlideId = fs.readFileSync('docs/pptx-presentation-sldid.xml').toString();
        let presentationSlideRel = fs.readFileSync('docs/pptx-presentation-slide-rel.xml').toString();
        let presentationRels = fs.readFileSync('docs/pptx-presentation-rels.xml').toString();
        let presentation = fs.readFileSync('docs/pptx-presentation.xml').toString();

        let contentTypes = fs.readFileSync('docs/pptx-content-types.xml').toString();
        let contentTypesSlide = fs.readFileSync('docs/pptx-content-types-slide.xml').toString();

        await decompress('docs/pptx-default.zip', folderName);
        

        let slideIds = "";
        let slideRels = "";
        let slideContentTypes = "";
    
        verses.forEach((verse, i) => {
            let paragraphs = "";
            let slideContents = verseSlideContents;
            let slideId = i + 1;
    
            if(i === 0) {
                slideContents = titleSlideContents.replace("%TITLE%", songName);
            }
            
            verse.text.split("\n").forEach(line => {
                if(line !== "") {
                    paragraphs += defaultParagraph.replace("%WORD%", line);
                }
            });
            let slide = slideContents.replace("%PARAGRAPHS%", paragraphs);

            slideIds += presentationSlideId.replace(/%ID_NUM%/g, slideId);
            slideRels += presentationSlideRel.replace(/%ID_NUM%/g, slideId);
            slideContentTypes += contentTypesSlide.replace(/%ID_NUM%/g, slideId);

            fs.writeFileSync(folderName + "/ppt/slides/_rels/slide" + slideId + ".xml.rels", slideRel);
            fs.writeFileSync(folderName + "/ppt/slides/slide" + slideId + ".xml", slide);
        });

        let fullPresentationRels = presentationRels.replace("%SLIDE_RELATIONSHIPS%", slideRels);
        let fullPresentation = presentation.replace("%SLIDE_IDS%", slideIds);
        let fullContentTypes = contentTypes.replace("%SLIDE_CONTENT_TYPES%", slideContentTypes);

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
