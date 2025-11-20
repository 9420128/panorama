import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

/** -----------------------
 * Заказы
 * ----------------------- */

/**
 * Сохраняет новый заказ
 * @param {Object} data
 * @returns {Promise<string>} id созданного документа
 */
export async function saveOrder(data) {
  try {
    const docRef = await addDoc(collection(db, "orders"), data);
    return docRef.id;
  } catch (err) {
    console.error("Ошибка записи в Firestore (saveOrder):", err);
    throw err;
  }
}

/**
 * Получение всех заказов
 * @returns {Promise<Array>}
 */
export async function getOrders() {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.error("Ошибка получения заказов (getOrders):", err);
    return [];
  }
}

/**
 * Обновление заказа
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<boolean>}
 */
export async function updateOrder(id, data) {
  try {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, data);
    return true;
  } catch (err) {
    console.error("Ошибка обновления заказа (updateOrder):", err);
    return false;
  }
}

/**
 * Удаление заказа
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function removeOrder(id) {
  try {
    await deleteDoc(doc(db, "orders", id));
    return true;
  } catch (err) {
    console.error("Ошибка удаления заказа (removeOrder):", err);
    return false;
  }
}

/** -----------------------
 * Suggestions (компоненты и услуги)
 * ----------------------- */

/**
 * Получение всех suggestions
 * @returns {Promise<{components: Array, services: Array}>}
 */
export async function getSuggestions() {
  try {
    const suggestions = { components: [], services: [] };

    for (const type of ["components", "services"]) {
      const colRef = collection(db, "suggestions", type, "items");
      const snapshot = await getDocs(colRef);

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        suggestions[type].push({
          id: docSnap.id,
          name: data.name || "",
          price: data.price || 0
        });
      });
    }

    return suggestions;
  } catch (err) {
    console.error("Ошибка получения suggestions:", err);
    return { components: [], services: [] };
  }
}

/**
 * Добавление нового suggestion
 * @param {string} type 'components' | 'services'
 * @param {{name: string, price: number}} item
 * @returns {Promise<Object|null>} добавленный объект с id
 */
export async function addSuggestion(type, item) {
  try {
    const colRef = collection(db, "suggestions", type, "items");
    const docRef = await addDoc(colRef, item);
    return { id: docRef.id, ...item };
  } catch (err) {
    console.error("Ошибка добавления suggestion:", err);
    return null;
  }
}

/**
 * Удаление suggestion по id
 * @param {string} type 'components' | 'services'
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function removeSuggestion(type, id) {
  try {
    const docRef = doc(db, "suggestions", type, "items", id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Ошибка удаления suggestion:", err);
    return false;
  }
}

