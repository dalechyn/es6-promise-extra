const toMix = {
  observe: 
    (pr, cb) => pr.then(
      msg => Promise.resolve(msg).then(cb),
      err => Promise.resolve(err).then(cb)
    ),
  first:
    prs => new Promise((resolve, reject) => {
      let rejected = 0;
      prs.forEach(
          pr => Promise.resolve(pr).then(
            resolve,
            err => { 
              if (rejected === prs.length - 1)
                Promise.reject(err).catch(reject)
              else rejected++
            })
        )
    }),
  last:
    prs => new Promise((resolve, reject) => {
      let rejected = 0
      let resolved = 0;
      prs.forEach(
        pr => Promise.resolve(pr).then(
          res => {
            if (resolved + rejected === prs.length - 1)
              Promise.resolve(res).then(resolve)
            else resolved++
          },
          err => { 
            if (rejected === prs.length - 1)
              Promise.reject(err).catch(reject) 
            else rejected++
            }
          )
      )
    }),
  any:
    prs => new Promise((resolve, reject) => {
      const arr = new Array(prs.length)
      let resolved = 0
      let rejected = 0
      prs.forEach(
        (pr, i) => Promise.resolve(pr).then(
          res => { 
            arr[i] = res 
            if (resolved + rejected === prs.length - 1)
              Promise.resolve(arr).then(resolve)
            else resolved++
          },
          err => { 
            arr[i] = err 
            if (resolved + rejected === prs.length - 1)
              Promise.resolve(arr).then(resolve)
            else rejected++
          }
        )
      )
    }),
  none:
    prs => new Promise((resolve, reject) => {
      const arr = new Array(prs.length)
      let rejected = 0
      prs.forEach(
        (pr, i) => Promise.resolve(pr).then(
          res => Promise.reject(res).catch(reject),
          err => {
            arr[i] = err
            if (rejected === prs.length - 1)
              Promise.resolve(arr).then(resolve)
            else rejected++
          }
        )
      )
    })
}

module.exports = Object.assign(Promise, toMix)
