declare module 'dom-to-image-more' {
    export function toPng(node: Node, options?: any): Promise<string>;
    export function toJpeg(node: Node, options?: any): Promise<string>;
    export function toSvg(node: Node, options?: any): Promise<string>;
    export function toBlob(node: Node, options?: any): Promise<Blob>;
}