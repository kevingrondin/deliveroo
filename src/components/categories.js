import { ScrollView } from 'react-native'
import CategoryCard from './categoryCard'
import { urlFor } from '../sanity'
import { useCategory } from '../queries'

export default function Categories() {
    const { data: categories } = useCategory()

    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {categories?.map(category => (
                <CategoryCard
                    key={category._id}
                    imgUrl={urlFor(category.image).width(200).url()}
                    title={category.name}
                />
            ))}
        </ScrollView>
    )
}