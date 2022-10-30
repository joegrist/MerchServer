import Jimp from 'jimp';

const root = "img/"
const input = `${root}product/1/`
const design = `${root}design/1/src.png`
const output  = `${root}design/1/preview/`
const color = 0x336699
const view = "Front"

class Point {
    constructor(public x: number, public y: number) {}
}

class Size {
    constructor(public width: number, public height: number) {}
}

class Frame {
    origin: Point
    size: Size

    constructor(x: number, y: number, width: number, height: number) {
        this.origin = new Point(x, y)
        this.size = new Size(width, height)
    }
}

async function main(): Promise<void> {
    let base = await Jimp.read(`${input}base.png`)
    let artworkMask = await Jimp.read(`${input}artwork_mask.png`)
    let colorMask = await Jimp.read(`${input}color_mask.png`)
    let artwork = await Jimp.read(design)
    let previewFrame = new Frame(0, 0, 1000, 2000)
    let artworkFrame = new Frame (100, 100, 800, 1800)
    await generate(artwork, base, artworkMask, colorMask, artworkFrame, previewFrame, color, view)
}

export async function generate(artwork: Jimp, product: Jimp, artworkMask: Jimp, colorMask: Jimp, artworkFrame: Frame, previewFrame: Frame, background: number, name: string) {

    // Scale source images for output
    product.cover(previewFrame.size.width, previewFrame.size.height)
    colorMask.cover(previewFrame.size.width, previewFrame.size.height)
    artworkMask.cover(previewFrame.size.width, previewFrame.size.height)
    artwork.contain(artworkFrame.size.width, artworkFrame.size.height)

    // Temporary images needed for processing steps
    var out = new Jimp(previewFrame.size.width, previewFrame.size.height)
    var baseColor = new Jimp(previewFrame.size.width, previewFrame.size.height, background)
    var productForeground = new Jimp(previewFrame.size.width, previewFrame.size.height)

    // Ugly Bit
    baseColor.mask(colorMask, 0, 0)
    product.composite(baseColor, 0, 0, {mode: Jimp.BLEND_MULTIPLY, opacitySource: 1, opacityDest: 1})
    productForeground.composite(product, 0, 0)
    product.mask(artworkMask, 0, 0)
    artworkMask.invert()
    productForeground.mask(artworkMask, 0, 0)
    artwork.scaleToFit

    // Composit
    out.composite(product, 0, 0)
    out.composite(artwork, artworkFrame.origin.x, artworkFrame.origin.y)
    out.composite(productForeground, 0, 0)

    // Save
    out.write(`${output}${name}.png`)
}

main()