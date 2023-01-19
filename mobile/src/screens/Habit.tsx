import { useRoute } from '@react-navigation/native'
import { ScrollView, Text, View } from 'react-native'
import dayjs from 'dayjs'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'

interface HabitParams {
  date: string
}

export function Habit() {
  const route = useRoute()
  const { date } = route.params as HabitParams

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayOfMonth = parsedDate.format('DD/MM')

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="text-zinc-400 mt-6 font-semibold text-base lowercase">
          { dayOfWeek }
        </Text>

        <Text className="text-white font-extraBold text-3xl">
          { dayOfMonth }
        </Text>

        <ProgressBar progress={50} />

        <View className="mt-6">
          <Checkbox
            title="Beber 2L de água"
            checked={false}
          />

          <Checkbox
            title="Caminhar"
            checked={true}
          />
        </View>
      </ScrollView>
    </View>
  )
}