import { UserRole, type authStoreType } from "@/util/types";
import { Store } from "@tanstack/store";

const intialDataStore: authStoreType = {
  isVerified: false,
  user: {
    tokens: {
      accessToken: '',
      refreshToken:''
    },
    user: {
      email: '',
      id: '',
      role:UserRole.CUSTOMER
    }
  }
}

export const authStore = new Store<authStoreType>(intialDataStore)


export const authActions = {
  setUser: (data:authStoreType) => {
    authStore.setState(data)
    localStorage.setItem('auth',JSON.stringify(data))
  },
  deleteUser: () => {
    authStore.setState(intialDataStore)
    localStorage.removeItem('auth')
  },
  intializeUser: () => {
    const userData = localStorage.getItem('auth')
    if (userData) {
      const userJson: authStoreType = JSON.parse(userData)
      console.log('data from localstorage',userJson)
      authStore.setState(userJson)
      console.log('store data',authStore.state)
    }
  }

}