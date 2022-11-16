//快速生成一个16*16的二维数组
let buttonArr = Array(16).fill('').map(()=>Array(16).fill({}))
//渲染游戏区域函数
const renderDiv = () => {
  document.querySelector('div').innerHTML = ''
  buttonArr.forEach((item, index) => {
    let ul = document.createElement('ul')
    //给ul标签添加自定义属性y
    ul.dataset.y = index
    item.forEach((item2, index2) => {
      let button = document.createElement('button')//遍历数组，绘制棋盘
      //给button标签添加自定义属性x，用来作为坐标使用
      button.dataset.x = index2
      if (item2.num === 10) {
        //给地雷元素添加一个自定义属性，便于识别
        button.dataset.z = 10
        //写的时候可以把地雷先渲染出来，写完了再注释掉
        // button.classList.add('active')
      } else {
        item2.num = 0
      }
      ul.appendChild(button)
    })
    document.querySelector('div').appendChild(ul)
  })
}
renderDiv()

//生成地雷
const lei = () => {
  let leiArr = []
  function fn() {
    //获取随机坐标
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    leiArr.push([y, x])
    if (leiArr.length == 40) {
      //数组去重
      let obj = {}
      leiArr.forEach(item => obj[item] = item)
      leiArr = Object.values(obj)
    }
    if (leiArr.length == 40) {
      return
    }
    fn()
  }
  fn()
  return leiArr
}
//渲染地雷
const renderLei = (arr) => {
  //把地雷对应的对象里面添加一个数据，便于识别
  arr.forEach(item => {
  //这个地方的赋值需要把数组里的对象深拷贝，否则会影响到其他对象里的值
    buttonArr = JSON.parse(JSON.stringify(buttonArr))
    buttonArr[item[0]][item[1]].num = 10
  })
}
renderLei(lei())
renderDiv()

//渲染格子数字
const renderNum = () => {
  buttonArr.forEach((item, i) => {
    item.forEach((item02, i02) => {
      if (item02.num == 0) {
        //获取不是地雷的标签
        let ul = document.querySelectorAll('ul')[i]
        let btn = ul.querySelectorAll('button')[i02]
        //调用获取格子数字的函数，传入3个参数，当前格子对应的数组元素，当前行，和当前格子
        getNum(item02, ul, btn)
        //判断这个格子是否带有数字
        if (item02.num < 10 && item02.num > 0) {
          //给有数字的格子添加一个自定义属性，便于识别
          btn.dataset.z = 1
          const span = document.createElement('span')
          //将数字渲染到格子中
          span.innerText = item02.num
          span.style.display = 'none'
          btn.appendChild(span)
        }
      }
    })
  })

}
//获取格子数字
const allUl = document.querySelectorAll('ul')
let getNumArr = []
////获取格子数字函数
const getNum = (item02, ul, btn) => {
  //建立一个存放目标格子周围一圈格子的数组
  getNumArr = []
  const y = ul.dataset.y
  const x = btn.dataset.x
  //调用获取格子周围一圈格子的函数，将格子的坐标传入参数
  getBox(x, y)
  //遍历这个格子周围一圈的格子，有地雷的话num就+1
  getNumArr.forEach(item1 => {
    if (item1.dataset.z == 10) {
      item02.num++
    }
  })
}
//获取格子周围一圈格子的函数
function getBox(x, y) {
  //第一排的格子只需要选中前两排
  if (y == 0) {
    for (let i = 0; i < 2; i++) {
      //选中前两排的格子
      const allButton01 = allUl[i].querySelectorAll('button')
      //如果两个格子x坐标相减的绝对值小于或等于1，那么这两个格子就是相邻的
      let getNumArr02 = Array.from(allButton01).filter(item => Math.abs(item.dataset.x - x) <= 1)
      //加入数组
      getNumArr.push(...getNumArr02)
    }
  }
  //第二排至倒数第二排，需要选中自身上中下三排的格子
  else if (y >= 1 && y < 15) {
    for (let i = +y - 1; i < +y + 2; i++) {
      const allButton02 = allUl[i].querySelectorAll('button')
      let getNumArr02 = Array.from(allButton02).filter(item => Math.abs(item.dataset.x - x) <= 1)
      getNumArr.push(...getNumArr02)
    }
  } else {  //最后一排，选中两排的格子遍历
    for (let i = 14; i < 16; i++) {
      const allButton03 = allUl[i].querySelectorAll('button')
      let getNumArr02 = Array.from(allButton03).filter(item => Math.abs(item.dataset.x - x) <= 1)
      getNumArr.push(...getNumArr02)
    }
  }
}
renderNum()

//点击事件
let allArr = [] //声明一个用来判断获胜的数组
allUl.forEach(buttons => {
  buttons.querySelectorAll('button').forEach(item => {
    item.addEventListener('click', function () {
      //点击效果
      this.classList.add('bgc1')
      //如果这个格子有数字，就显示
      if (this.querySelector('span')) {
        this.querySelector('span').style.display = 'block'
      }
      allArr.push(this)
      //判断，如果点击的是地雷，游戏结束
      if (item.dataset.z == 10) {
        item.classList.add('active')
        setTimeout(function () {
          alert('游戏失败')
          location.reload()
        }, 200)
      }
      //只有空白的格子没有自定义的z属性，判断如果点击的是空白格子
      if (!item.dataset.z) {
        const num0Arr = []
        num0(item)
        //空白格子的周围一圈一定没有地雷，直接让这些格子显示类容
        function num0(item) {
          getNumArr = []
          const buttons = item.parentNode
          const y = buttons.dataset.y
          const x = item.dataset.x
          //再次调用获取周围一圈格子的函数
          getBox(x, y)
          getNumArr.forEach(itemBtn => {
            //点击空白格，就会自动把周围一圈的格子都显示
            if (itemBtn.dataset.z != 10) {
              itemBtn.classList.add('bgc1')
            }
            if (itemBtn.querySelector('span')) {
              itemBtn.querySelector('span').style.display = 'block'
            }
            //将这些格子都加入总数组中
            allArr.push(itemBtn)
            if (!itemBtn.dataset.z) {
              //如果空白格周围一圈格子里面还有空白格，就将他们加入这个num0数组中，稍后再次循环一次这个点击事件
              num0Arr.push(itemBtn)
            }
          })
        }
        //给空白格周围的空白格也添加一个显示类容的函数
        function clickNum0() {
          //num0Arr包含了点击的空白格周围9个格子内的所有空白格子，newNum0Arr就是除掉自身的所有空白格子
          const newNum0Arr = num0Arr.filter(item2 => item2 != item)
          newNum0Arr.forEach(item02 => {
            //再次在其他空白格身上调用显示周围一圈内容的函数，这样就形成点击一个空白格子，
            //如果这个格子周围空白区域很多，能显示一大片区域的效果。
            num0(item02)
          })
        }
        clickNum0()
      }
      //给总数组去重
      const newAllArr = [...new Set(allArr)]
      //筛选，排除是地雷的格子
      const newAllArr02 = newAllArr.filter(item => item.dataset.z != 10)
      //一共256个格子，40个地雷，如果数组长度达到216，就可以判定胜利了。
      if (newAllArr02.length == 216) {
        alert('游戏胜利！')
        location.reload()
      }
    })
    //鼠标右键点击事件，用来插棋子
    item.addEventListener('contextmenu', function () {
      if (!this.classList.contains('bgc3') && !this.classList.contains('bgc1')) {
        this.classList.add('bgc3')
      } else {
        this.classList.remove('bgc3')
      }

    })
  })
})

//鼠标右键屏蔽菜单
document.oncontextmenu = function (event) {
  if (window.event) {
    event = window.event;
  }
  try {
    var the = event.srcElement;
    if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
} 