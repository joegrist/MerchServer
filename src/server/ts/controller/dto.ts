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
    supplierName: string
    supplierThumbnail: string
}

export class DesignDTO {
    name: string
}

export class OrderDTO {
    quantity: number
    priceCents: number
    id: string
    variation: string
    purchased: string
    fulfilled: string
    customer: CustomerDTO
    design: DesignDTO

    checked: boolean = false
}

export class FulfilmentDTO {
    filfilled: boolean
    orders: string[]
}