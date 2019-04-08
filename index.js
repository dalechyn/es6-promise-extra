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
              if(rejected !== prs.length - 1)
                rejected++
              else 
                Promise.reject(err).catch(reject) 
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
            if(resolved + rejected !== prs.length - 1)
              resolved++
            else
              Promise.resolve(res).then(resolve)
          },
          err => { 
            if(rejected !== prs.length - 1)
              rejected++
            else {
              Promise.reject(err).catch(reject) 
            }
          })
      )
    })
}

module.exports = Object.assign(Promise, toMix)
