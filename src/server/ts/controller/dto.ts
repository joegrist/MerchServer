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
    purchaseableId: number
    purchaseableName: string
}

export class PurchaseableVariationsDTO {
    id: number
    name: string
    variations: string[]
}

export class PurchaseableDTO {
    id: number
    shopSlug: string
    purchaseableId: number
    purchaseableName: string
    name: string
    thumbnail: string
    priceCents: number
    views: PurchaseableViewDTO[]
    variations: PurchaseableVariationsDTO[]
}