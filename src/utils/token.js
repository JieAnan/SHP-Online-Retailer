
// 专门存储有关用户的token信息

export const setToken = (token) => {
  localStorage.setItem('TOKEN', token)
}

export const getToken = () => {
  localStorage.getItem('TOKEN')
}