/**
 *
 * @param src
 */
function getImage(src: string | null): HTMLImageElement {
    const tempImg = new Image();
    tempImg.src = src || String();

    return tempImg;
}

export default {
    getImage,
};
