import { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { Alert, ScrollView, Text, View } from 'react-native'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { Loading } from '../components/Loading'
import { Checkbox } from '../components/Checkbox'
import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { HabitsEmpty } from '../components/HabitsEmpty'

import { api } from '../lib/axios'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

interface HabitParams {
  date: string
}

interface HabitsInfo {
  possibleHabits: {
    id: string
    title: string
  }[]
  completedHabits: string[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo | null>(null)

  const route = useRoute()
  const { date } = route.params as HabitParams

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayOfMonth = parsedDate.format('DD/MM')

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(habitsInfo.possibleHabits.length, habitsInfo.completedHabits.length)
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const { data } = await api.get('day', { params: { date } })
      setHabitsInfo(data)
    } catch (err) {
      console.log(err)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)

      const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
      let completedHabits

      if (isHabitAlreadyCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
      } else {
        completedHabits = [...habitsInfo!.completedHabits, habitId]
      }

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits
      })
    } catch (err) {
      console.log(err)
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.')
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return <Loading />
  }

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

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx('mt-6', {
            'opacity-50': isDateInPast
          })}
        >
          {
            habitsInfo?.possibleHabits ? (
              habitsInfo.possibleHabits.map(habit => (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  disabled={isDateInPast}
                  checked={habitsInfo.completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              ))
            ) : (
              <HabitsEmpty />
            )
          }
        </View>

        { isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos de uma data passada.
          </Text>
        ) }
      </ScrollView>
    </View>
  )
}