import { Image, View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect, useEffect, useState } from 'react'
import { AdjustmentsIcon, ChevronDownIcon, SearchIcon, UserIcon } from 'react-native-heroicons/outline'
import sanityClient from '../sanity'
import Categories from '../components/categories'
import FeaturedRow from '../components/featuredRow'

export default function HomeScreen() {
    const navigation = useNavigation()
    const [featuredCategories, setFeaturedCategories] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    })

    useEffect(() => {
        sanityClient.fetch(`*[_type == "featured"]{
            ...,
            restaurants[]->{
                ...,
                dishes[]->
            }
        }`).then(data => {
            setFeaturedCategories(data)
        }
        )
    }, [])

    return (
        <SafeAreaView className="bg-white h-screen">
            <View className="flex-row items-center w-full pb-3 px-2 space-x-2">
                <Image
                    source={{ uri: 'https://links.papareact.com/wru ' }}
                    className="h-7 w-7 bg-gray-300 p-4 rounded-full"
                />
                <View className="flex-1">
                    <Text className="font-bold text-gray-400 text-xs">
                        Deliver Now!
                    </Text>
                    <View className="flex-row">
                        <Text className="font-bold text-xl">
                            Current Location
                        </Text>
                        <View className="pt-1 pl-2">
                            <ChevronDownIcon size={20} color="#00CCBB" />
                        </View>
                    </View>
                </View>

                <UserIcon size={35} color="#00CCBB" />
            </View>

            <View className="flex-row items-center space-x-2 pb-2 px-2">
                <View className="flex-1 flex-row items-center space-x-2 bg-gray-200 p-3">
                    <SearchIcon color="gray" size={20} />
                    <TextInput placeholder="Restaurants and cuisines" keyboardType='default' />
                </View>

                <AdjustmentsIcon color="#00CCBB" />
            </View>

            <ScrollView
                className="bg-gray-100"
                contentContainerStyle={{ paddingBottom: 125 }}
            >
                <Categories />

                {featuredCategories?.map(category => (
                    <FeaturedRow
                        key={category._id}
                        id={category._id}
                        title={category.name}
                        description={category.shot_description}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}