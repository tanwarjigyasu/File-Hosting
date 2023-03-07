// This is a compiling file for compiling SASS or SCSS
// Just add type="pre-proccessing" in the style tag
// Then import this file and it will convert all internal and external SASS or SCSS files in the following webpage to CSS

const importScript = () => {
    let sassScript = document.createElement("script");
    sassScript.src = "https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.9.12/sass.sync.min.js";
    document.head.appendChild(sassScript);
}

importScript();

const compileText = text => {
    Sass.compile(text, resp => {
        let cssTag = document.createElement("style");
        cssTag.innerHTML = resp.text;
        resp.formatted && console.error(resp.formatted);
        resp.text && document.head.appendChild(cssTag);
    });
}

const combineText = () => {
    let styleTag = document.createElement("style");
    document.querySelectorAll("style[fetched='true']").forEach(tag => styleTag.innerHTML += "\n" + tag.innerHTML + "\n");
    styleTag.innerHTML += "\n" + document.querySelector("style[type='pre-proccessing']").innerHTML + "\n";
    document.head.appendChild(styleTag);
    compileText(styleTag.innerHTML);
}

const convertText = libText => {
    var linkTag = document.createElement("style");
    linkTag.setAttribute("fetched", "true");
    linkTag.innerHTML = libText;
    document.head.appendChild(linkTag);
    combineText();
}

const makeText = url => {
    fetch(url)
        .then(resp => resp.text())
        .then(data => convertText(data))
}

window.addEventListener("load", () => {
    // If document contains external SASS or SCSS
    if (document.head.contains(document.querySelector("link[href]"))) {
        document.querySelectorAll("link[href]").forEach(link => {
            if (link.getAttribute("href").endsWith(".scss") || link.getAttribute("href").endsWith(".sass")) {
                makeText(link.getAttribute("href"));
            }
        });
    }

    // For internal SASS or SCSS
    document.querySelectorAll("style").forEach(tag => compileText(tag.innerHTML));
});
