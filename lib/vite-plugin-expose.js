const x = (l = {}) => {
  const {
    globalObject: e = "self"
  } = l, a = Array.isArray(l.exposes) ? l.exposes : [l.exposes].filter(Boolean), r = "__vite_expose_loaded__";
  return {
    name: "vite-plugin-expose",
    transform(d, m) {
      const f = [], t = [];
      t.push(`
        (function() {
          if (!${e}.${r}) {
            ${e}.${r} = {};
          }
      `);
      for (const $ of a) {
        if (!$ || typeof $ != "object") continue;
        const { modulePath: c, globalName: u, members: s } = $, h = c.replace(/\W/g, "_"), p = `${r}_${h}`;
        t.push(`
          if (!${e}.${p}) {
            ${e}.${p} = true;
        `);
        let n = "";
        if (s)
          Array.isArray(s) ? s.forEach((o) => {
            const i = u || o;
            n += `
                if (typeof ${e}.${i} === 'undefined') {
                  ${e}.${i} = ${o};
                }
              `;
          }) : typeof s == "object" && Object.entries(s).forEach(([o, i]) => {
            n += `
                if (typeof ${e}.${o} === 'undefined') {
                  ${e}.${o} = ${i};
                }
              `;
          });
        else {
          console.log("非member-hhhh");
          const o = u || c.split("/").pop().replace(/\..+$/, "");
          n += `
            if (typeof ${e}.${o} === 'undefined') {
              import('${c}').then(module => {
                ${e}.${o} = module.default || module;
              }).catch(err => {
                console.error('Failed to expose module ${c}', err);
              });
            }
          `, console.log("injection---", n);
        }
        n && f.push(n), t.push("}");
      }
      return t.push("})();"), f.length ? {
        code: `${d}

// Injected by vite-plugin-expose
${t.join(`
`)}
${f.join(`
`)}`,
        map: null
      } : null;
    }
  };
};
export {
  x as vitePluginExpose
};
