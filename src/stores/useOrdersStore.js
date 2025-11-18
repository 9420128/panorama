import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { saveOrder, getOrders, updateOrder, removeOrder } from "@/firebase/firebaseService";

export const useOrdersStore = defineStore("orders", () => {

  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()

  // Основной объект заказа
  const order = reactive({
    id: '',
    user: {
      client: '',
      phone: '',
      address: ''
    },
    total: {
      units: 0,
      qty: 0,
      sum: 0,
      name: `Коммерческое предложение 958${day} от ${day}.${month}.${year}`
    },
    percent: {
      units: 0,
      components: 0,
      services: 0,
    },
    tableData: []
  })

  // Локальное хранилище сохранённых заказов
  const orders = ref([]);

  // === Методы для TABLE DATA ===
  const setTableData = () => {

    console.log(order.tableData)

    const newData = order.tableData.map(row => {
      const normalizedOptions = Array.isArray(row.options)
        ? row.options.map(opt => Array.isArray(opt)
          ? { name: opt[0] ?? '', price: opt[1] ?? 0, quantity: opt[2] ?? 0, total: opt[3] ?? 0 }
          : opt)
        : []

      const normalizedPrice = Array.isArray(row.price)
        ? row.price.map(p => Array.isArray(p)
          ? { price: p[0] ?? 0, quantity: p[1] ?? 0, total: p[2] ?? 0 }
          : p)
        : []

      return { ...row, options: normalizedOptions, price: normalizedPrice }
    })

    order.tableData.splice(0, order.tableData.length, ...newData)
  }


  const updatePage = async () => {
    try {
      await updateOrder(order.id, {
        user: order.user,
        total: order.total,
        tableData: order.tableData
      });

      const index = orders.value.findIndex(o => o.id === order.id)
      if (index !== -1) {
        // Делаем копию, чтобы реактивность точно сработала
        orders.value[index] = JSON.parse(JSON.stringify(order))
      }

      alert("Данные обновлены в Firebase!")
    } catch (err) {
      console.error('Ошибка при обновлении:', err)
    }
  }


  const removePage = async (id) => {
    try {
      await removeOrder(id)
      // локально удаляем заказ
      orders.value = orders.value.filter(o => o.id !== id)
    } catch (err) {
      console.error('Ошибка при удалении:', err)
    }
  }


  // === Сохранение текущего заказа в Firebase ===
  const savePage = async () => {
    try {
      await saveOrder(order)
      alert("Данные сохранены в Firebase!")
      orders.value.push(JSON.parse(JSON.stringify(order))) // сохраняем локально копию
    } catch (err) {
      console.error(err)
      alert("Ошибка сохранения")
    }
  }

  // === Получение заказов из Firebase ===
  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders()

      if (fetchedOrders.length) {
        orders.value = fetchedOrders.map(order => {
          return {
            ...order,
            tableData: order.tableData.map(block => ({
              ...block,
              options: block.options?.map(opt => ({
                name: opt.name || '',
                price: Number(String(opt.price).replace(/\s+/g, '').replace(',', '.')) || 0,
                quantity: Number(opt.quantity) || 0,
                total: Number(String(opt.total).replace(/\s+/g, '').replace(',', '.')) || 0
              })) || [],
              price: block.price?.map(p => ({
                price: Number(p.price) || 0,
                quantity: Number(p.quantity) || 0,
                total: Number(p.total) || 0
              })) || []
            })),
            total: {
              ...order.total,
              sum: Number(String(order.total.sum).replace(/\s+/g, '').replace(',', '.')) || 0
            },
            percent: {
              ...order.percent,
              units: Number(order.percent.units) || 0,
              components: Number(order.percent.components) || 0,
              services: Number(order.percent.services) || 0
            },
            // id: order.id
          }
        })
      }

      console.log("✅ Заказы загружены:", orders.value.length)
    } catch (err) {
      console.error("Ошибка при получении заказов:", err)
      alert("Не удалось загрузить заказы")
    }
  }

  return {
    order,
    orders,
    updatePage,
    setTableData,
    removePage,
    savePage,
    fetchOrders
  }
})
