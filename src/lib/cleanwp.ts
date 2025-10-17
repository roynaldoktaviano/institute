import DOMPurify from "dompurify";

// bersihin + rapihin struktur paragraf & spasi kosong
export function cleanAndNormalizeHTML(rawHTML: string) {
  // step 1: sanitize (hapus tag berbahaya)
  let clean = DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "ul", "ol", "li",
      "img", "h2", "h3", "h4", "span"
    ],
    ALLOWED_ATTR: ["src", "alt", "width", "height", "loading", "decoding", "class"],
  });

  // step 2: hapus atribut WordPress gak penting
  clean = clean.replace(/ data-[^=]+="[^"]*"/g, "");

  // step 3: hapus <p> kosong dan <br> berlebihan
  clean = clean
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />")
    .replace(/<p>\s*<br\s*\/?>\s*/gi, "<p>")
    .replace(/\s*<br\s*\/?>\s*<\/p>/gi, "</p>");

  // step 4: hapus newline biar rapi
  clean = clean.replace(/\n+/g, "");

  return clean;
}
