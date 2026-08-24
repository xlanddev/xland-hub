// ===============================
// XLAND Security v4.2
// Frontend Security + Video Security
// ===============================

"use strict";


// =========================================================
// CONFIG
// =========================================================

const XLAND_SECURITY = {

    maxText: 500,
    maxTitle: 150,
    maxDescription: 1000,
    maxCategory: 50,
    maxFilename: 180,
    maxURL: 2048,

    maxComment: 500,

    commentCooldown: 3000,
    maxCommentsPerMinute: 5,

    maxVideos: 500,

    allowedVideoExtensions: [
        ".mp4",
        ".webm",
        ".ogg",
        ".m4v"
    ],

    blockedProtocols: [
        "javascript:",
        "data:",
        "vbscript:",
        "file:",
        "blob:"
    ]

};


// =========================================================
// TYPE CHECK
// =========================================================

function isString(value) {

    return typeof value === "string";

}


function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );

}


function isNumber(value) {

    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );

}


// =========================================================
// NORMALIZE SPACES
// =========================================================

function normalizeSpaces(text) {

    if (!isString(text)) {

        return "";

    }

    return text
        .replace(/\s+/g, " ")
        .trim();

}


// =========================================================
// LIMIT TEXT
// =========================================================

function limitText(
    text,
    max = XLAND_SECURITY.maxText
) {

    if (!isString(text)) {

        return "";

    }

    if (text.length > max) {

        return text.substring(0, max);

    }

    return text;

}


// =========================================================
// SANITIZE TEXT
// =========================================================

function sanitizeInput(
    text,
    max = XLAND_SECURITY.maxText
) {

    if (!isString(text)) {

        return "";

    }

    text = normalizeSpaces(text);

    text = limitText(text, max);

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHTML(text) {

    if (!isString(text)) {

        return "";

    }

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =========================================================
// EMPTY CHECK
// =========================================================

function isEmpty(text) {

    if (!isString(text)) {

        return true;

    }

    return text.trim() === "";

}


// =========================================================
// EMAIL
// =========================================================

function validateEmail(email) {

    if (!isString(email)) {

        return false;

    }

    email = email.trim();

    if (email.length > 100) {

        return false;

    }

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}


// =========================================================
// USERNAME
// =========================================================

function validateUsername(username) {

    if (!isString(username)) {

        return false;

    }

    username = username.trim();

    return /^[A-Za-z0-9_]{3,20}$/.test(username);

}


// =========================================================
// PASSWORD
// =========================================================

function validatePassword(password) {

    if (!isString(password)) {

        return false;

    }

    if (
        password.length < 8 ||
        password.length > 128
    ) {

        return false;

    }

    const hasLetter =
        /[A-Za-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    return hasLetter && hasNumber;

}


// =========================================================
// JSON VALIDATION
// =========================================================

function isValidJSON(data) {

    if (!isString(data)) {

        return false;

    }

    try {

        JSON.parse(data);

        return true;

    }
    catch {

        return false;

    }

}


// =========================================================
// SAFE URL
// =========================================================

function isSafeURL(value) {

    if (!isString(value)) {

        return false;

    }

    value = value.trim();

    if (
        !value ||
        value.length > XLAND_SECURITY.maxURL
    ) {

        return false;

    }

    if (
        value.includes("\0") ||
        /[\u0000-\u001F\u007F]/.test(value)
    ) {

        return false;

    }

    const lower =
        value.toLowerCase();

    for (
        const protocol
        of XLAND_SECURITY.blockedProtocols
    ) {

        if (
            lower.startsWith(protocol)
        ) {

            return false;

        }

    }

    // Relative paths

    if (
        value.startsWith("./") ||
        value.startsWith("/")
    ) {

        return !value.includes("../");

    }

    // Absolute URLs

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );

    }
    catch {

        return false;

    }

}


// =========================================================
// SAFE LINK
// =========================================================

function isSafeLink(link) {

    if (!isString(link)) {

        return false;

    }

    if (
        link.includes("..") ||
        link.includes("\0")
    ) {

        return false;

    }

    return /^[a-zA-Z0-9_\-\/.#?=&%:]+$/.test(link);

}


// =========================================================
// SAFE VIDEO URL
// =========================================================

function isSafeVideoURL(value) {

    if (!isSafeURL(value)) {

        return false;

    }

    const lower =
        value.toLowerCase();

    // Absolute URL

    if (
        lower.startsWith("http://") ||
        lower.startsWith("https://")
    ) {

        return hasAllowedVideoExtension(
            lower
        );

    }

    // Relative video path

    return hasAllowedVideoExtension(
        lower
    );

}


// =========================================================
// VIDEO EXTENSION
// =========================================================

function hasAllowedVideoExtension(
    value
) {

    return XLAND_SECURITY.allowedVideoExtensions
        .some(extension =>
            value.split("?")[0]
                .split("#")[0]
                .endsWith(extension)
        );

}


// =========================================================
// SAFE VIDEO FILENAME
// =========================================================

function isSafeVideoFilename(
    filename
) {

    if (!isString(filename)) {

        return false;

    }

    filename =
        filename.trim();

    if (
        !filename ||
        filename.length >
        XLAND_SECURITY.maxFilename
    ) {

        return false;

    }

    if (
        filename.includes("..") ||
        filename.includes("\\") ||
        filename.includes("\0")
    ) {

        return false;

    }

    if (
        /[<>:"|?*]/.test(filename)
    ) {

        return false;

    }

    return hasAllowedVideoExtension(
        filename.toLowerCase()
    );

}


// =========================================================
// VIDEO CATEGORY
// =========================================================

function sanitizeVideoCategory(
    category
) {

    if (!isString(category)) {

        return "";

    }

    category =
        normalizeSpaces(category);

    category =
        limitText(
            category,
            XLAND_SECURITY.maxCategory
        );

    return category
        .replace(/[<>]/g, "");

}


// =========================================================
// VIDEO TITLE
// =========================================================

function sanitizeVideoTitle(title) {

    if (!isString(title)) {

        return "";

    }

    title =
        normalizeSpaces(title);

    title =
        limitText(
            title,
            XLAND_SECURITY.maxTitle
        );

    return escapeHTML(title);

}


// =========================================================
// VIDEO DESCRIPTION
// =========================================================

function sanitizeVideoDescription(
    description
) {

    if (!isString(description)) {

        return "";

    }

    description =
        normalizeSpaces(description);

    description =
        limitText(
            description,
            XLAND_SECURITY.maxDescription
        );

    return escapeHTML(description);

}


// =========================================================
// COMMENT SECURITY
// =========================================================

function sanitizeComment(comment) {

    if (!isString(comment)) {

        return "";

    }

    comment =
        comment.trim();

    comment =
        limitText(
            comment,
            XLAND_SECURITY.maxComment
        );

    return escapeHTML(comment);

}


// =========================================================
// COMMENT RATE LIMIT
// =========================================================

function canSubmitComment() {

    const now =
        Date.now();

    const lastComment =
        Number(
            sessionStorage.getItem(
                "xland_last_comment"
            )
        ) || 0;

    if (
        now - lastComment <
        XLAND_SECURITY.commentCooldown
    ) {

        return false;

    }

    let timestamps;

    try {

        timestamps =
            JSON.parse(
                sessionStorage.getItem(
                    "xland_comment_times"
                )
            ) || [];

    }
    catch {

        timestamps = [];

    }

    timestamps =
        timestamps.filter(
            time =>
                now - time < 60000
        );

    if (
        timestamps.length >=
        XLAND_SECURITY.maxCommentsPerMinute
    ) {

        return false;

    }

    timestamps.push(now);

    sessionStorage.setItem(
        "xland_comment_times",
        JSON.stringify(timestamps)
    );

    sessionStorage.setItem(
        "xland_last_comment",
        String(now)
    );

    return true;

}


// =========================================================
// RESET COMMENT LIMIT
// =========================================================

function resetCommentLimit() {

    sessionStorage.removeItem(
        "xland_last_comment"
    );

    sessionStorage.removeItem(
        "xland_comment_times"
    );

}


// =========================================================
// VIDEO OBJECT VALIDATION
// =========================================================

function validateVideoObject(video) {

    if (!isObject(video)) {

        return {
            valid: false,
            reason: "Video is not an object"
        };

    }

    if (
        video.title !== undefined &&
        !isString(video.title)
    ) {

        return {
            valid: false,
            reason: "Invalid title"
        };

    }

    if (
        video.description !== undefined &&
        !isString(video.description)
    ) {

        return {
            valid: false,
            reason: "Invalid description"
        };

    }

    if (
        video.category !== undefined &&
        !isString(video.category)
    ) {

        return {
            valid: false,
            reason: "Invalid category"
        };

    }

    // Video URL

    const videoURL =
        video.video ||
        video.url ||
        video.src;

    if (videoURL !== undefined) {

        if (
            !isSafeVideoURL(videoURL)
        ) {

            return {
                valid: false,
                reason: "Unsafe video URL"
            };

        }

    }

    // Thumbnail

    if (
        video.thumbnail !== undefined
    ) {

        if (
            !isSafeURL(video.thumbnail)
        ) {

            return {
                valid: false,
                reason: "Unsafe thumbnail URL"
            };

        }

    }

    // Filename

    if (
        video.filename !== undefined
    ) {

        if (
            !isSafeVideoFilename(
                video.filename
            )
        ) {

            return {
                valid: false,
                reason: "Unsafe video filename"
            };

        }

    }

    return {
        valid: true,
        reason: "OK"
    };

}


// =========================================================
// SANITIZE VIDEO OBJECT
// =========================================================

function sanitizeVideo(video) {

    if (
        !validateVideoObject(video).valid
    ) {

        return null;

    }

    const clean = {
        ...video
    };

    if (video.title !== undefined) {

        clean.title =
            sanitizeVideoTitle(
                video.title
            );

    }

    if (
        video.description !== undefined
    ) {

        clean.description =
            sanitizeVideoDescription(
                video.description
            );

    }

    if (video.category !== undefined) {

        clean.category =
            sanitizeVideoCategory(
                video.category
            );

    }

    return clean;

}


// =========================================================
// VIDEOS.JSON VALIDATION
// =========================================================

function validateVideosJSON(data) {

    if (!isObject(data)) {

        return {
            valid: false,
            videos: [],
            reason: "Invalid JSON structure"
        };

    }

    const result = [];

    const collections = [];

    if (Array.isArray(data.videos)) {

        collections.push(data.videos);

    }

    if (Array.isArray(data.longVideos)) {

        collections.push(data.longVideos);

    }

    if (Array.isArray(data.shortVideos)) {

        collections.push(data.shortVideos);

    }

    if (
        collections.length === 0
    ) {

        return {
            valid: false,
            videos: [],
            reason: "No video collection found"
        };

    }

    let total = 0;

    for (
        const collection
        of collections
    ) {

        for (
            const video
            of collection
        ) {

            if (
                total >=
                XLAND_SECURITY.maxVideos
            ) {

                break;

            }

            const checked =
                sanitizeVideo(video);

            if (checked) {

                result.push(checked);

            }

            total++;

        }

    }

    return {

        valid: true,

        videos: result,

        rejected:
            total - result.length,

        reason: "OK"

    };

}


// =========================================================
// FETCH JSON SAFELY
// =========================================================

async function loadVideosJSON(
    url = "videos.json"
) {

    if (!isSafeURL(url)) {

        throw new Error(
            "Unsafe videos.json URL"
        );

    }

    const response =
        await fetch(
            url,
            {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to load videos.json"
        );

    }

    const text =
        await response.text();

    if (
        text.length >
        5 * 1024 * 1024
    ) {

        throw new Error(
            "videos.json is too large"
        );

    }

    if (!isValidJSON(text)) {

        throw new Error(
            "Invalid videos.json"
        );

    }

    const data =
        JSON.parse(text);

    const result =
        validateVideosJSON(data);

    if (!result.valid) {

        throw new Error(
            result.reason
        );

    }

    return result;

}


// =========================================================
// LOGIN ATTEMPT LIMIT
// =========================================================

function checkLoginAttempts() {

    const attempts =
        Number(
            localStorage.getItem(
                "loginAttempts"
            )
        ) || 0;

    const lockUntil =
        Number(
            localStorage.getItem(
                "loginLockUntil"
            )
        ) || 0;

    if (
        Date.now() < lockUntil
    ) {

        return false;

    }

    return attempts < 5;

}


function addLoginAttempt() {

    let attempts =
        Number(
            localStorage.getItem(
                "loginAttempts"
            )
        ) || 0;

    attempts++;

    localStorage.setItem(
        "loginAttempts",
        attempts
    );

    if (attempts >= 5) {

        localStorage.setItem(
            "loginLockUntil",
            Date.now() + 30000
        );

        localStorage.setItem(
            "loginAttempts",
            "0"
        );

    }

}


function resetLoginAttempts() {

    localStorage.removeItem(
        "loginAttempts"
    );

    localStorage.removeItem(
        "loginLockUntil"
    );

}


// =========================================================
// FILE SIZE
// =========================================================

function validateFileSize(
    size,
    maxSize
) {

    if (!isNumber(size)) {

        return false;

    }

    return (
        size >= 0 &&
        size <= maxSize
    );

}


// =========================================================
// LOGIN SENSITIVE DATA CLEANUP
// =========================================================

function clearLoginSensitiveData() {

    const passwordFields =
        document.querySelectorAll(
            'input[type="password"]'
        );

    passwordFields.forEach(
        field => {

            field.value = "";

        }
    );


    const loginForms =
        document.querySelectorAll(
            'form[data-login-form]'
        );

    loginForms.forEach(
        form => {

            form.reset();

        }
    );

}


// =========================================================
// SECURITY STATUS
// =========================================================

function getXlandSecurityStatus() {

    return {

        version: "4.1",

        xssProtection: true,

        urlValidation: true,

        videoValidation: true,

        jsonValidation: true,

        commentProtection: true,

        commentRateLimit: true,

        filenameValidation: true,

        htmlEscaping: true

    };

}


// =========================================================
// GLOBAL XLAND SECURITY API
// =========================================================

window.XlandSecurity = {

    isString,

    isObject,

    normalizeSpaces,

    limitText,

    sanitizeInput,

    escapeHTML,

    isEmpty,

    validateEmail,

    validateUsername,

    validatePassword,

    isValidJSON,

    isSafeLink,

    isSafeURL,

    isSafeVideoURL,

    isSafeVideoFilename,

    sanitizeVideoTitle,

    sanitizeVideoDescription,

    sanitizeVideoCategory,

    sanitizeComment,

    canSubmitComment,

    resetCommentLimit,

    validateVideoObject,

    sanitizeVideo,

    validateVideosJSON,

    loadVideosJSON,

    validateFileSize,

    checkLoginAttempts,

    addLoginAttempt,

    resetLoginAttempts,

    clearLoginSensitiveData,

    getXlandSecurityStatus

};


// =========================================================
// SECURITY LOADED
// =========================================================

console.group(
    "🛡 XLAND Security v4.1"
);

console.log(
    "✅ XSS Protection"
);

console.log(
    "✅ Input Sanitization"
);

console.log(
    "✅ HTML Escape"
);

console.log(
    "✅ Email Validation"
);

console.log(
    "✅ Username Validation"
);

console.log(
    "✅ Password Validation"
);

console.log(
    "✅ JSON Validation"
);

console.log(
    "✅ videos.json Validation"
);

console.log(
    "✅ Video URL Validation"
);

console.log(
    "✅ Video Filename Validation"
);

console.log(
    "✅ Thumbnail URL Validation"
);

console.log(
    "✅ Video Data Sanitization"
);

console.log(
    "✅ Comment Protection"
);

console.log(
    "✅ Comment Rate Limiting"
);

console.log(
    "✅ Login Attempt Protection"
);

console.log(
    "✅ Sensitive Data Cleanup"
);

console.log(
    "🛡 Security API Ready"
);

console.groupEnd();