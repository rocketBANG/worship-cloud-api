import express = require("express");
import { getEnvValue } from "../utils/EnvironmentManager";
import { getObj } from "../UserManager";

const verifyUser = async (req: express.Request): Promise<boolean> => {
    let user = await getObj().VerifyUser(req.headers["auth-token"]);
    if (!user) {
        const loginCookie = req.session.worship_login;
        const token = loginCookie && loginCookie.split("|")[0];
        user = await getObj().VerifyUser(token);
        if (!user) {
            return false;
        }
    }
    return true;
}

const pathAuth: IPathAuth[] = [ 
    { path: "*", validator: verifyUser },
    { path: "/login", validator: () => true }, 
    { path: "/users/:username", method: "POST", validator: () => false } 
];
const baseUrl = getEnvValue("BASE_URL") || "";

export interface IPathAuth {
    path: string;
    method?: string;
    validator?: (req: express.Request) => Promise<boolean> | boolean
}

export async function RouteAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const relatedPaths = pathAuth.filter(p => !p.method || p.method === req.method);

    const matchedPath = getMatch(relatedPaths, req.path.replace(baseUrl, ""));
    if (matchedPath) {
        if (!matchedPath.validator || await matchedPath.validator(req)) {
            next();
            return;    
        } 
    }

    if (req.method === "OPTIONS") {
        res.json();
        return;
    }

    res.statusCode = 401;
    res.json();
    return;
}

// Matches paths in the forms
// /string/:entity/*
// Where :entity and * are wildcards
// Returns the last matching path
const getMatch = (paths: IPathAuth[], search: string): IPathAuth => {
    const searchExploded = search.split("/").filter(s => s);

    const pathMatches: IPathAuth[] = [];

    for(const path of paths) {
        const pathExploded = path.path.split("/").filter(s => s);
        if (pathExploded.length > searchExploded.length) continue;

        let matching = true;
        for (let j = 0; j < searchExploded.length; j++) {
            if (j >= pathExploded.length) break;

            if (pathExploded[j].startsWith(":") || pathExploded[j] === "*") continue;
            if (searchExploded[j] !== pathExploded[j]) {
                matching = false;
                break;
            }
        }
        if (matching) {
            pathMatches.push(path);
        }
    }

    return pathMatches.length > 0 ? pathMatches[pathMatches.length - 1] : undefined;
}