export class PurchaseDTO {
    id: string
    purchaseable: PurchaseableDTO
    quantity: number
    variation: string
}

export class CustomerDTO {
    name: string
    email: string
    mobile: string
    cart: PurchaseDTO[]
}

export class PurchaseableViewDTO {
    id: number
    thumbnail: string
    name: string
    background: number
}

export class PurchaseableVariationsDTO {
    id: number
    name: string
    options: string
}

export class PurchaseableDTO {
    id: number
    merchantSlug: string
    purchaseableId: number
    purchaseableName: string
    productId: number
    productName: string
    name: string
    thumbnail: string
    priceCents: number
    views: PurchaseableViewDTO[]
    variations: PurchaseableVariationsDTO[]
}