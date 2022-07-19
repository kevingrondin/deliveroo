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
    queryFn: () => [],
})
export const useAddArticleOnBasket = () => {
    const qc = useQueryClient()
    return useMutation((article) => {
        qc.setQueryData(["basket"], [...qc.getQueryData(["basket"]), article])
    })
}
export const useGroupArticlesById = () => {
    const qc = useQueryClient()
    const dataGroupedItems = qc.getQueryData(["basket"]).reduce((results, item) => {
        (results[item.id] = results[item.id] || []).push(item)
        return results
    }, {})
    return dataGroupedItems
    return qc.getQueryData(["basket"]).reduce((acc, article) => {
        (acc[article.id] = article[article.id] || []).push(article)
        return acc
    }, {})
}

export const useDeleteOneArticleFromBasket = () => {
    const qc = useQueryClient()
    return useMutation(({id}) => {
        const idQty = qc.getQueryData(["basket"]).filter(a => a.id === id).length
        if (idQty > 1) {
            const articles = qc.getQueryData(["basket"]).filter(article => article.id === id)
            const articleFiltered = qc.getQueryData(["basket"]).filter(article => article.id !== id)
            const articlesToAdd = Array.from({length: idQty - 1}, () => articles[0])
            const articlesEdited = [...articleFiltered, ...articlesToAdd]
            qc.setQueryData(["basket"], articlesEdited)
        } else {
            qc.setQueryData(["basket"], qc.getQueryData(["basket"]).filter(article => article.id !== id))
        }
    })
}
export const useRemoveArticleFromBasket = () => {
    const qc = useQueryClient()
    return useMutation((id) => {
        qc.setQueryData(["basket"], qc.getQueryData(["basket"]).filter(article => article.id !== id))
    })
}
export const useGetAllArticlesFromBasket = () => {
    const qc = useQueryClient()
    return qc.getQueryData(["basket"]) ?? []
}
export const useGetAllArticlesFromBasketWithId = (id) => {
    const qc = useQueryClient()
    return qc.getQueryData(["basket"])?.filter(article => article.id === id) ?? []
}
export const useGetTotalPrice = () => {
    const qc = useQueryClient()
    return qc.getQueryData(["basket"])?.reduce((acc, article) => acc + article.price, 0) ?? 0
}

