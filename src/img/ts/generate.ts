import Jimp from 'jimp';
import { Logger } from "../../common/logger"

const root = "img/"
const input = `${root}view`
const design = `${root}design`
const log = new Logger()

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

export async function process(description: string, name: string, viewId: number, designId: number, color: number): Promise<void> {
    try {
        let base = await Jimp.read(`${input}/${viewId}/base.png`)
        let artworkMask = await Jimp.read(`${input}/${viewId}/artwork_mask.png`)
        let colorMask = await Jimp.read(`${input}/${viewId}/color_mask.png`)
        let artwork = await Jimp.read(`${design}/${designId}/src.png`)
        let previewFrame = new Frame(0, 0, 1000, 2000)
        let artworkFrame = new Frame (100, 100, 800, 1800)
        log.log(`Processing ${description}`)
        await generate(artwork, base, artworkMask, colorMask, artworkFrame, previewFrame, color, name, designId)
    } catch (e) {
        log.err(`Skipping ${description}`, e)
    }
    
}

export async function generate(artwork: Jimp, product: Jimp, artworkMask: Jimp, colorMask: Jimp, artworkFrame: Frame, previewFrame: Frame, background: number, name: string, id: number) {

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
    out.write(`${design}/${id}/preview/${name}.png`)
}
