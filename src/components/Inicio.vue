<template>
  <div class="flex flex-col ">
    <div class="flex flex-wrap flex-auto">
      <!-- Calendario -->
      <div class=" md:w-2/5 pr-4">
        <div class="calendar mt-10 ml-10">
          <div class="header">
            <button class="flecha" @click="prevMonth">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="m4.431 12.822l13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-1.569-.823l-13 9a1.003 1.003 0 0 0 0 1.645" />
              </svg>
            </button>
            <div class="month">{{ currentMonth }} 2024</div>
            <button class="flecha" @click="nextMonth">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886" />
              </svg>
            </button>
          </div>
          <div class="days font-bold rounded">
            <div v-for="(day, index) in daysInMonth" :key="index" :class="[
              'day flex flex-col items-center justify-between',
              {
                'bg-red-200': isSunday(day),
                'bg-green-500': !hasCitasEnDia(day),
                'bg-orange-400': hasCitasEnDia(day),
                'bg-pink-400': isCurrentDay(day),
                'bg-gray-300': isPastDay(day)
              }]" @click="addAppointment(day)">
              <span class="text-sm font-bold mb-1 mt-0 bg-white w-full px-2 py-1 items-start">Citas: {{
                getCitasPendientes(day) }}</span>
              <h2 class="text-lg font-bold mb-5">{{ day }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Div citas -->
      <div class="w-auto  md:w-2/5 ml-56 px-3 py-4 overflow-y-auto mt-24">
        <h3 class="text-lg font-semibold mb-4">Citas del día {{ selectedDay }}</h3>
        <div v-if="citasDelDia.length > 0" id="1">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            <table v-if="citasDelDia.length > 0" class="w-full text-sm  rtl:text-right text-gray-500 dark:text-gray-400 ">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="p-4">
                    Hecha
                  </th>
                  <th class="px-6 py-3">Hora</th>
                  <th class="px-6 py-3">Nombre</th>
                  <th class="px-6 py-3">Tratamiento</th>
                  <th class="px-6 py-3">Precio</th>
                  <th class="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(cita, index) in citasDelDia" :key="index"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input id="checkbox-table-search-1" type="checkbox" @click="terminarCita(cita, cita.date)"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                    </div>
                  </td>
                  <td class="px-6 py-3">{{ cita.time }}</td>
                  <td class="px-6 py-3">{{ cita.name }}</td>
                  <td class="px-6 py-3">{{ cita.treatment }}</td>
                  <td class="px-6 py-3">{{ cita.price }}€</td>
                  <td class="px-6 py-3 flex justify-end">
                    <a v-if="editar = true && guardarEdicion == false" @click="habilitarEdicion()"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                      Editar
                    </a>
                    <a v-else class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                      Guardar
                    </a>
                    <a @click="cancelarCita(cita, cita.date)"
                      class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer">
                      Eliminar
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>
          <p class="text-red-400">No hay citas para este día.</p>
        </div>
      </div>

      <!-- Creador de citas -->
      <button @click="toggleSidebar" id="toggleSidebarBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
          class="bi bi-chevron-double-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          <path fill-rule="evenodd"
            d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
        </svg>
      </button>
      <aside id="default-sidebar" :class="{ 'hidden': sidebarHidden }"
        class="fixed top-0 right-0 w-auto transition-transform ">
        <div id="sb" class=" px-3 py-4 overflow-y-auto  bg-gray-400 dark:bg-gray-800  ">
          <h2 class="font-semibold mb-4 text-center text-white text-2xl mt-12">Añadir cita</h2>
          <div class="mb-4">
            <input type="text" placeholder="Nombre" v-model="appointment.name" class="campoFormulario " required>
          </div>

          <div class="mb-4">
            <input type="text" placeholder="Telefono" v-model="appointment.telefono" class="campoFormulario " required>
          </div>
          <div class="mb-4">
            <select v-model="appointment.treatment" class="campoFormulario " required>
              <option value="">Seleccionar tratamiento</option>
              <option value="Peinar">Peinar</option>
              <option value="Pelo">Pelo</option>
              <option value="Teñir">Teñir</option>
              <option value="Barba">Barba</option>
              <option value="Completo">Completo (Pelo + Barba)</option>
            </select>
          </div>
          <div class="mb-4">
            <input type="date" v-model="appointment.date" class="campoFormulario " required>
          </div>
          <div class="mb-4">
            <select v-model="appointment.time" class="campoFormulario " required>
              <option value="">Seleccionar hora</option>
              <option v-for="hour in horasDisponibles" :value="hour" :disabled="isHoraOcupada(hour)"
                :style="{ color: isHoraOcupada(hour) ? 'red' : 'green' }">{{ hour }}</option>
            </select>

          </div>
          <div class="mb-4">
            <input type="number" placeholder="Precio" v-model="appointment.price" class="campoFormulario" required>
          </div>
          <button @click="saveAppointment"
            class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mr-2 mb-14 text-2xl ml-2 ">Guardar </button>
          <p class="text-white text-center text-sm">&copy; 2024 Alejandro Fonterosa Martínez. Todos los derechos
            reservados.</p>

        </div>
      </aside>
    </div>

    <!-- ALERTAS-->
    <div id="toast-success"
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 absolute bottom-0 right-0"
      role="alert" v-if="mostrarAlerta">
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">Cita {{ msgalerta }}</div>
      <button type="button" @click="cerrarAlerta"
        class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
    <div id="toast-danger"
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 absolute bottom-0 right-0"
      role="alert" v-if="mostrarError">
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span class="sr-only">Error icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ msgError }}</div>
      <button @click="cerrarAlertaError" type="button"
        class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-danger" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
import Navbar from './Nav.vue';
import { getFirestore, collection, query, where, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      editar: true,
      guardarEdicion: false,
      msgError: '',
      mostrarError: false,
      msgalerta: '',
      horasDisponibles: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',],
      mostrarAlerta: false,
      allAppointments: [],
      currentDate: new Date(),
      currentMonth: '',
      daysInMonth: [],
      selectedDay: new Date().getDate(),
      sidebarHidden: true,
      appointment: {
        name: '',
        telefono: '',
        treatment: '',
        date: new Date().toISOString().substr(0, 10),
        time: '',
        price: null,
        terminada: false,
        id: Math.random().toString(36).slice(2)
      },
      treatmentPrices: {
        Peinar: 10,
        Pelo: 20,
        Teñir: 30,
        Barba: 15,
        Completo: 30
      },
      citasDelDia: [],
      mostrarCitas: false,
    };
  },
  watch: {
    'appointment.treatment': function (newTreatment) {
      if (this.treatmentPrices.hasOwnProperty(newTreatment)) {
        this.appointment.price = this.treatmentPrices[newTreatment];
      } else {
        this.appointment.price = null;
      }
    }
  },
  mounted() {
    this.setMonth();
    this.generateDays();
    this.loadAllAppointments();
    this.obtenerCitasDelDia(this.appointment.date);

  },
  methods: {
    habilitarEdicion() {
      this.editar = false;
      this.guardarEdicion = true;
    },
    isPastDay(day) {
      const currentDate = new Date();
      const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const isPast = dayDate < currentDate;
      return isPast;
    },

    hasCitasEnDia(day) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;
      const fecha = `${year}-${formattedMonth}-${formattedDay}`;
      return this.allAppointments.some(cita => cita.fecha === fecha);
    },
    getCitasPendientes(day) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;
      const fecha = `${year}-${formattedMonth}-${formattedDay}`;
      const citasDelDia = this.allAppointments.filter(cita => cita.date === fecha && cita.terminada === false);
      return citasDelDia.length;
    },
    cerrarAlerta() {
      this.mostrarAlerta = false;
    },
    cerrarAlertaError() {
      this.mostrarError = false;
    },
    async loadAllAppointments() {
      try {
        const db = getFirestore();
        const citasSnapshot = await getDocs(collection(db, 'citas'), where('terminada', '==', false));
        const citas = [];
        citasSnapshot.forEach(doc => {
          citas.push(doc.data());
        });
        this.allAppointments = citas;
      } catch (error) {
        console.error('Error al obtener citas del calendario:', error.message);
      }
    },
    toggleSidebar() {
      this.sidebarHidden = !this.sidebarHidden;
    },
    async obtenerCitasDelDia(fecha) {
      try {
        const db = getFirestore();
        const q = query(collection(db, 'citas'), where('date', '==', fecha), where('terminada', '==', false));
        const citasSnapshot = await getDocs(q);
        const citas = [];
        citasSnapshot.forEach(doc => {
          citas.push(doc.data());
        });
        this.citasDelDia = citas;

      } catch (error) {
        console.error('Error al obtener citas del día:', error.message);
      }
    },
    async cancelarCita(cita, fecha) {
      try {
        const db = getFirestore();
        const citasSnapshot = await getDocs(collection(db, 'citas'));
        citasSnapshot.forEach(doc => {
          if (doc.data().id === cita.id) {
            const citaRef = doc.ref;
            deleteDoc(citaRef)
              .then(() => {
                this.obtenerCitasDelDia(fecha);
                this.loadAllAppointments();
              })
              .catch(error => {
                console.error('Error al cancelar la cita:', error.message);
              });
          }
        });
      } catch (error) {
        console.error('Error al cancelar la cita:', error.message);
      }
    },
    async terminarCita(cita, fecha) {
      this.msgalerta = "completada correctamente";
      this.mostrarAlerta = true;
      try {
        const db = getFirestore();
        const citasSnapshot = await getDocs(collection(db, 'citas'));
        citasSnapshot.forEach(doc => {
          if (doc.data().id === cita.id) {
            const citaRef = doc.ref;
            updateDoc(citaRef, { terminada: true })
              .then(() => {
                this.obtenerCitasDelDia(fecha);
                this.loadAllAppointments();
              })
              .catch(error => {
                console.error('Error al finalizar la cita:', error.message);
              });
          }
        });
      } catch (error) {
        console.error('Error al finalizar la cita:', error.message);
      }
    },
    isSunday(day) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const date = new Date(year, month, day);
      return date.getDay() === 0;
    },
    isCurrentDay(day) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const today = new Date(year, month, day);
      const currentDate = new Date();
      return currentDate.getFullYear() === year &&
        currentDate.getMonth() === month &&
        currentDate.getDate() === today.getDate();
    },
    setMonth() {
      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      this.currentMonth = monthNames[this.currentDate.getMonth()];
    },
    generateDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      let firstDayOfMonth = new Date(year, month, 1).getDay();
      if (firstDayOfMonth === 0) {
        firstDayOfMonth = 6;
      } else {
        firstDayOfMonth -= 1;
      }
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);
      const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      this.daysInMonth = [...emptyCells, ...daysOfMonth];
    },
    addAppointment(day) {
      this.selectedDay = day;
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      this.appointment.date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      this.obtenerCitasDelDia(this.appointment.date);
    },
    formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    async saveAppointment() {
      try {
        const currentDate = new Date();
        const selectedDate = new Date(this.appointment.date);

        // Formatear las fechas
        const formattedCurrentDate = this.formatDate(currentDate);
        const formattedSelectedDate = this.formatDate(selectedDate);

        if (formattedSelectedDate < formattedCurrentDate) {
          this.msgError = 'No se pueden programar citas en días anteriores al actual';
          this.mostrarError = true;
          return;
        }

        if (this.appointment.name == '' || this.appointment.telefono == '' || this.appointment.treatment == '' || this.appointment.date == '' || this.appointment.time == '' || this.appointment.price == '') {
          this.msgError = 'Completa todos los campos';
          this.mostrarError = true;
          return;
        }

        // Verificar si hay una cita programada para esta hora
        const existingAppointment = this.citasDelDia.find(cita => cita.time === this.appointment.time);
        if (existingAppointment) {
          console.error('Ya hay una cita programada para esta hora');
          return;
        }

        // Guardar la cita en Firebase Cloud Firestore
        const db = getFirestore();
        await addDoc(collection(db, 'citas'), this.appointment);

        // Resto del código para manejar la respuesta exitosa
        this.msgalerta = "Cita creada correctamente";
        this.mostrarAlerta = true;

        this.appointment = {
          name: '',
          telefono: '',
          treatment: '',
          date: new Date().toISOString().substr(0, 10),
          time: '',
          price: '',
          treatment: '',
          terminada: false,
          id: Math.random().toString(36).slice(2),
        };
        this.selectedDay = null;
        this.obtenerCitasDelDia(this.appointment.date);
        this.loadAllAppointments();
      } catch (error) {
        console.error('Error al guardar la cita:', error.message);
      }
    },
    isHoraOcupada(hour) {
      const currentHour = new Date().getHours();
      const selectedHour = parseInt(hour.split(':')[0]);
      if (selectedHour < currentHour) {
        return true;
      }
      return this.citasDelDia.some(cita => cita.time === hour);
    },
    prevMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.setMonth();
      this.generateDays();
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.setMonth();
      this.generateDays();
    }
  }
};
</script>
<style scoped>
@keyframes smoothFadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

#default-sidebar {
  animation: smoothFadeIn .5s ease-in-out forwards;
  width: 300px;
  background-color: #f1f1f1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

#toggleSidebarBtn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
}

.campoFormulario {
  background-color: #f6f6f6;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 100%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

.campoFormulario::placeholder {
  color: #474444;
}

select {
  color: #474444;
}



input:focus {
  outline: none !important;
  border-color: transparent !important;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header button {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.month {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 18px;
  column-gap: 38px;
}

.day {
  width: 100px !important;
  height: 100px !important;
  border-radius: 5px;
  border: 2px solid #000000;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.day:hover {
  background-color: rgb(252, 255, 95);
  transition: background-color .4s;
}

.flecha:hover {
  color: rgb(255, 172, 95);
  transition: color .2s;

}
</style>
