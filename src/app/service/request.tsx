export default function useRequests(){
    const endpoints={
        getAllProducts:`${process.env.NEXT_BACKEND_API_URL}/product`,
        createProduct:`${process.env.NEXT_BACKEND_API_URL}/product`,
        deleteProductById:`${process.env.NEXT_BACKEND_API_URL}/Product`,
        updateProductById:`${process.env.NEXT_BACKEND_API_URL}/product`,
        getProductById:`${process.env.NEXT_BACKEND_API_URL}/product`,
    }
    return endpoints;
}