class Torony {
    #oszlop
    #sor
    #varakozas
    #szog
    #sebzes
    #hatotav
    #ar
    #szint
    #maxSzint

    constructor(oszlop, sor, sebzes, hatotav, ar) {
        this.setOszlop(oszlop)
        this.setSor(sor)
        this.setSebzes(sebzes)
        this.setHatotav(hatotav) 
        this.setAr(ar)
        this.setVarakozas(0)
        this.setSzog(0)
        this.setSzint(1)
        this.#maxSzint = 5
    }

    getOszlop() { 
        return this.#oszlop 
    }

    getSor() { 
        return this.#sor 
    }

    getVarakozas() { 
        return this.#varakozas 
    }

    getSzog() { 
        return this.#szog 
    }

    getSebzes() { 
        return this.#sebzes 
    }

    getHatotav() { 
        return this.#hatotav 
    }

    getAr() { 
        return this.#ar
     }

    getSzint() { 
        return this.#szint 
    }

    getMaxSzint() { 
    return this.#maxSzint 
    }

    setOszlop(oszlop) { 
        this.#oszlop = oszlop 
    }

    setSor(sor) { 
        this.#sor = sor 
    }

    setSebzes(sebzes) { 
        this.#sebzes = sebzes 
    }

    setHatotav(hatotav) { 
        this.#hatotav = hatotav 
    }

    setAr(ar) { 
        this.#ar = ar 
    }

    setSzint(szint) { 
        this.#szint = szint 
    }

    setVarakozas(varakozas) { 
        this.#varakozas = varakozas 
    }

    setSzog(szog) { 
        this.#szog = szog 
    }

    fejleszthetoE() {
        return this.#szint < this.#maxSzint
    }

    fejleszt() {
        if (!this.fejleszthetoE()) {
            return false
        }
        this.#szint++
        if (this.#szint === this.#maxSzint) {
                this.#sebzes = Math.pow(this.#sebzes, 1.1)
                this.#hatotav = Math.pow(this.#hatotav, 1.1)
        } else {
                this.#sebzes *= 1.25
                this.#hatotav *= 1.25
        }   
        return true
    }
}