import { useQuery, useMutation, useQueryClient } from "react-query"
import sanityClient from './sanity'

export function useFeatured() {
    return useQuery("featured", () => {
        return sanityClient.fetch(`*[_type == "featured"]{
            ...,
            restaurants[]->{
                ...,
                dishes[]->
            }
        }`)
    }
    )
}

export function useCategory() {
    return useQuery("category", () => {
        return sanityClient.fetch(`*[_type == "category"]`)
    })
}

const getFeaturedById = (id) => {
    return sanityClient.fetch(
        `
            *[_type == "featured" && _id == $id]{
                ...,
                restaurants[]->{
                    ...,
                    dishes[]->,
                    type-> {
                        name
                    }
                },
            }[0]
        `,
        { id }
    ).then(data => data?.restaurants)
}
export function useFeaturedById(id) {
    return useQuery(["featured", id], () => getFeaturedById(id))
}

export const useBasket = () => ({
    queryKey: ["basket"],
    queryFn: () => { return [] },
})

export const useAddArticleOnBasket = (article) => {
    const qc = useQueryClient()
    return useMutation(() => {
        qc.setQueryData(["basket"], [...qc.getQueryData(["basket"]), article])
    })
}
export const useRemoveArticleFromBasket = (id) => {
    const qc = useQueryClient()
    return useMutation(() => {
        qc.setQueryData(["basket"], qc.getQueryData(["basket"]).filter(article => article.id !== id))
    })
}
export const useGetAllArticlesFromBasket = () => {
    const qc = useQueryClient()
    return qc.getQueryData(["basket"]) ?? []
}
export const useGetAllArticlesFromBasketWithId = (id) => {
    const qc = useQueryClient()
    return qc.getQueryData(["basket"]).filter(article => article.id === id)
}

