var terkep = [
    [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1],
    [1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 2],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
    [1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
 
const CSEMPE = 56
const SOROK = terkep.length
const OSZLOPOK = terkep[0].length
 
var utvonal = []
var zoldVaz = []
var zoldek = ["#6fae55", "#69a64f", "#74b459"]
 
var vaszon = document.querySelector("#vaszon")
var ctx = vaszon.getContext("2d")
vaszon.width = OSZLOPOK * CSEMPE
vaszon.height = SOROK * CSEMPE
 
var hatter = document.createElement("canvas")
hatter.width = vaszon.width
hatter.height = vaszon.height

 
function utVan(oszlop, sor) {
    if (sor < 0 || sor >= SOROK) return false
    if (oszlop < 0) oszlop = 0
    if (oszlop >= OSZLOPOK) oszlop = OSZLOPOK - 1
    return terkep[sor][oszlop] === 0
}
 
function utvonalEpit() {
    var o = 0
    var s = 0
    for (let i = 0; i < SOROK; i++) {
        if (terkep[i][0] === 0) s = i
    }
    var irany = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    var jart = []
 
    utvonal.push({ x: -CSEMPE / 2, y: s * CSEMPE + CSEMPE / 2 })
    var mehet = true
    while (mehet) {
        utvonal.push({ x: o * CSEMPE + CSEMPE / 2, y: s * CSEMPE + CSEMPE / 2 })
        jart.push(o + "," + s)
        mehet = false
        for (let i = 0; i < 4; i++) {
            var uo = o + irany[i][0]
            var us = s + irany[i][1]
            var bent = uo >= 0 && uo < OSZLOPOK && us >= 0 && us < SOROK
            if (bent && utVan(uo, us) && !jart.includes(uo + "," + us)) {
                o = uo
                s = us
                mehet = true
                break
            }
        }
    }
    utvonal.push({ x: OSZLOPOK * CSEMPE + CSEMPE / 2, y: s * CSEMPE + CSEMPE / 2 })
}
 
function hatterRajzol() {
    var b = hatter.getContext("2d")
    for (let sor = 0; sor < SOROK; sor++) {
        for (let oszlop = 0; oszlop < OSZLOPOK; oszlop++) {
            var x = oszlop * CSEMPE
            var y = sor * CSEMPE
 
            b.fillStyle = zoldek[zoldVaz[sor][oszlop]]
            b.fillRect(x, y, CSEMPE, CSEMPE)
 
            if (terkep[sor][oszlop] === 0) {
                b.fillStyle = "#c9a56e"
                b.fillRect(x, y, CSEMPE, CSEMPE)
 
                b.fillStyle = "#8a6a43"
                if (!utVan(oszlop, sor - 1)) b.fillRect(x, y, CSEMPE, 4)
                if (!utVan(oszlop, sor + 1)) b.fillRect(x, y + CSEMPE - 4, CSEMPE, 4)
                if (!utVan(oszlop - 1, sor)) b.fillRect(x, y, 4, CSEMPE)
                if (!utVan(oszlop + 1, sor)) b.fillRect(x + CSEMPE - 4, y, 4, CSEMPE)
            }
        }
    }
}
 
function fatRajzol(oszlop, sor) {
    var x = oszlop * CSEMPE + CSEMPE / 2
    var y = sor * CSEMPE + CSEMPE
    ctx.fillStyle = "#6b4a2b"
    ctx.fillRect(x - 5, y - 26, 10, 24)
    ctx.fillStyle = "#2f6b34"
    ctx.beginPath()
    ctx.arc(x, y - 44, 24, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#4a9a4c"
    ctx.beginPath()
    ctx.arc(x - 6, y - 52, 14, 0, Math.PI * 2)
    ctx.fill()
}
 
function terkepRajzol() {
    ctx.drawImage(hatter, 0, 0)
    for (let sor = 0; sor < SOROK; sor++) {
        for (let oszlop = 0; oszlop < OSZLOPOK; oszlop++) {
            if (terkep[sor][oszlop] === 2) fatRajzol(oszlop, sor)
        }
    }
}
 
document.addEventListener("DOMContentLoaded", () => {
    for (let sor = 0; sor < SOROK; sor++) {
        zoldVaz.push([])
        for (let oszlop = 0; oszlop < OSZLOPOK; oszlop++) {
            zoldVaz[sor].push(Math.floor(Math.random() * 3))
        }
    }
    utvonalEpit()
    hatterRajzol()
    terkepRajzol()
})