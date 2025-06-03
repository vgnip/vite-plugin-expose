export const vitePluginExpose = (options: any = {}) => {
    const {
        globalObject = 'self',
    } = options;
    const exposes = Array.isArray(options.exposes) ? options.exposes : [options.exposes].filter(Boolean);
    const checkIdentifier = '__vite_expose_loaded__';

    return {
        name: 'vite-plugin-expose',

        transform(code: string, flePath: string) {
            // console.log('code--,flePath--',code,flePath)
            const injections = [];
            const checks = [];

            // 添加全局检查
            checks.push(`
        (function() {
          if (!${globalObject}.${checkIdentifier}) {
            ${globalObject}.${checkIdentifier} = {};
          }
      `);

            for (const expose of exposes) {
                if (!expose || typeof expose !== 'object') continue;

                const { modulePath, globalName, members } = expose;
                const moduleKey = modulePath.replace(/\W/g, '_');
                const moduleCheck = `${checkIdentifier}_${moduleKey}`;

                checks.push(`
          if (!${globalObject}.${moduleCheck}) {
            ${globalObject}.${moduleCheck} = true;
        `);

                let injection = '';

                if (members) {
                    // 暴露特定成员
                    if (Array.isArray(members)) {
                        members.forEach(member => {
                            const exposedName = globalName || member;
                            injection += `
                if (typeof ${globalObject}.${exposedName} === 'undefined') {
                  ${globalObject}.${exposedName} = ${member};
                }
              `;
                        });
                    } else if (typeof members === 'object') {
                        Object.entries(members).forEach(([exposedName, originalName]) => {
                            injection += `
                if (typeof ${globalObject}.${exposedName} === 'undefined') {
                  ${globalObject}.${exposedName} = ${originalName};
                }
              `;
                        });
                    }
                } else {
                    // 暴露整个模块 - 改用动态导入
                    console.log("非member-hhhh")
                    const moduleName = globalName || modulePath.split('/').pop().replace(/\..+$/, '');
                    injection += `
            if (typeof ${globalObject}.${moduleName} === 'undefined') {
              import('${modulePath}').then(module => {
                ${globalObject}.${moduleName} = module.default || module;
              }).catch(err => {
                console.error('Failed to expose module ${modulePath}', err);
              });
            }
          `;
                    console.log('injection---', injection)
                }
                if (injection) {
                    injections.push(injection);
                }

                checks.push('}');
            }

            checks.push('})();');

            if (injections.length) {
                return {
                    code: `${code}\n\n// Injected by vite-plugin-expose\n${checks.join('\n')}\n${injections.join('\n')}`,
                    map: null
                };
            }

            return null;
        }
    };
}
