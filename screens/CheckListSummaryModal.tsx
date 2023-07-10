import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Divider } from '@rneui/themed'
import { FontAwesome5 } from '@expo/vector-icons'
import { PieChart } from 'react-native-chart-kit'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const getTasks = async ({ queryKey }: any) => {
    const [_key, { id }] = queryKey;
    const colRef = collection(db, "events", id, "checklist");
    const data = await getDocs(colRef);
    const obj = {
        count: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    };

    obj.count = data.docs.length;

    data.docs.forEach((doc) => {
        const { completed, dueDate } = doc.data();
        if (completed === "Completed") {
            obj.completed++;
        } else if (completed === "Pending") {
            obj.pending++;
        } else if (completed === "Overdue") {
            obj.overdue++;
        }
    });

    return {
        ...obj,
        checklistIds: data.docs.map((doc) => doc.id)
    };
}

const calculate = async (eventId: string, checklistIds: string[]): Promise<{
    count: number,
    completed: number,
    pending: number,
    overdue: number
}> => {
    const obj = {
        count: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    };

    const data = checklistIds.map(async (checklistId: string) => {
        const colRef = collection(db, "events", eventId, "checklist", checklistId, "subtask");
        const data = await getDocs(colRef);
        obj.count += data.docs.length;
        data.docs.forEach((doc) => {
            const { completed, dueDate } = doc.data();
            if (completed === "Completed") {
                obj.completed++;
            } else if (completed === "Pending") {
                obj.pending++;
            } else if (completed === "Overdue") {
                obj.overdue++;
            }
        });
    });

    return Promise.all(data).then(() => obj).catch((err) => {
        console.log(err);
        return obj;
    });

}

const getSubTasks = async ({ queryKey }: any) => {
    const [_key, { eventId, checklistIds }] = queryKey;

    if (checklistIds.length > 0) {
        const obj = await calculate(eventId, checklistIds);
        return obj;
    }

    return {
        count: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    }
}

export default function CheckListSummaryModal() {

    const queryClient = useQueryClient();
    const currentEventId = queryClient.getQueryData(["currentEventId"], {
        exact: true
    })

    const tasks = useQuery(["tasks", { id: currentEventId }], getTasks, {
        staleTime: 5000,
        cacheTime: 5000
    });

    const subtasks = useQuery(["subtasks", { eventId: currentEventId, checklistIds: tasks.data?.checklistIds }], getSubTasks, {
        staleTime: 5000,
        cacheTime: 5000,
        enabled: !!tasks.data?.checklistIds
    });

    return (
        <View>
            <View className='bg-white p-2 m-2 border border-transparent rounded-lg overflow-hidden'>
                <View className='flex flex-row justify-start items-center gap-x-4'>
                    <Ionicons name="ios-stats-chart-outline" size={24} color="black" />
                    <Text>STATISTICS</Text>
                </View>
                <Divider width={1} style={{
                    marginVertical: 5
                }} />
                <View className='flex flex-row justify-between items-center'>
                    <View className='flex flex-col justify-center gap-y-4'>
                        <Text>Tasks</Text>
                        <Text>Subtasks</Text>
                    </View>
                    <View className='flex flex-col justify-center gap-y-4'>
                        <Text>{tasks && tasks.data?.count}</Text>
                        <Text>{subtasks && subtasks.data?.count}</Text>
                    </View>
                </View>
            </View>
            <View className='bg-white p-2 m-2 border border-transparent rounded-lg overflow-hidden'>
                <View className='flex flex-row items-center justify-start gap-x-5'>
                    <FontAwesome5 name="tasks" size={24} color="black" />
                    <Text>TASKS</Text>
                </View>
                <Divider width={1} style={{
                    marginVertical: 10
                }} />
                <PieChart data={[
                    {
                        name: "Completed",
                        population: tasks.data?.completed || 0,
                        color: "#2ecc71",
                        legendFontColor: "#2ecc71",
                        legendFontSize: 15
                    },
                    {
                        name: "Pending",
                        population: tasks.data?.pending || 0,
                        color: "#e74c3c",
                        legendFontColor: "#e74c3c",
                        legendFontSize: 15
                    },
                    {
                        name: "Overdue",
                        population: tasks.data?.overdue || 0,
                        color: "#f1c40f",
                        legendFontColor: "#f1c40f",
                        legendFontSize: 15
                    }
                ]}
                    width={Dimensions.get("window").width} height={120}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    absolute
                />
            </View>
            <View className='bg-white p-2 m-2 border border-transparent rounded-lg overflow-hidden'>
                <View className='flex flex-row items-center justify-start gap-x-5'>
                    <FontAwesome5 name="tasks" size={24} color="black" />
                    <Text>SUBTASKS</Text>
                </View>
                <Divider width={1} style={{
                    marginVertical: 10
                }} />
                <PieChart data={[
                    {
                        name: "Completed",
                        population: subtasks.data?.completed || 0,
                        color: "#2ecc71",
                        legendFontColor: "#2ecc71",
                        legendFontSize: 15
                    },
                    {
                        name: "Pending",
                        population: subtasks.data?.pending || 0,
                        color: "#e74c3c",
                        legendFontColor: "#e74c3c",
                        legendFontSize: 15
                    },
                    {
                        name: "Overdue",
                        population: subtasks.data?.overdue || 0,
                        color: "#f1c40f",
                        legendFontColor: "#f1c40f",
                        legendFontSize: 15
                    }
                ]}
                    width={Dimensions.get("window").width} height={120}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    absolute
                />
            </View>
        </View>
    )
}