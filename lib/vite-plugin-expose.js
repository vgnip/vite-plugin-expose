const x = (i = {}) => {
  const {
    globalObject: e = "self"
  } = i, a = Array.isArray(i.exposes) ? i.exposes : [i.exposes].filter(Boolean), r = "__vite_expose_loaded__";
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
        const { modulePath: c, globalName: u, members: n } = $, h = c.replace(/\W/g, "_"), p = `${r}_${h}`;
        t.push(`
          if (!${e}.${p}) {
            ${e}.${p} = true;
        `);
        let s = "";
        if (n)
          Array.isArray(n) ? n.forEach((o) => {
            const l = u || o;
            s += `
                if (typeof ${e}.${l} === 'undefined') {
                  ${e}.${l} = ${o};
                }
              `;
          }) : typeof n == "object" && Object.entries(n).forEach(([o, l]) => {
            s += `
                if (typeof ${e}.${o} === 'undefined') {
                  ${e}.${o} = ${l};
                }
              `;
          });
        else {
          const o = u || c.split("/").pop().replace(/\..+$/, "");
          s += `
            if (typeof ${e}.${o} === 'undefined') {
              import('${c}').then(module => {
                ${e}.${o} = module.default || module;
              }).catch(err => {
                console.error('Failed to expose module ${c}', err);
              });
            }
          `;
        }
        s && f.push(s), t.push("}");
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
