const BASE_ROUTE = `${process.env.NEXT_BACKEND_API_URL}/product`;

export default function Requests(){
    const endpoints={
        getAllProducts:BASE_ROUTE,
        createProduct:BASE_ROUTE,
        deleteProductById:BASE_ROUTE,
        updateProductById:BASE_ROUTE,
        getProductById:BASE_ROUTE,
    }
    return endpoints;
}