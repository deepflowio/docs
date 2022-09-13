const tabs = require('./tabs')

module.exports = (md) => {
    tabs(md, {
        name: "code-tabs",
        component: "CodeTabs",
        getter: (tokens, index) => {
            let inCodeTab = false;
            let foundFence = false;
            const codeTabsData = [];

            for (let i = index; i < tokens.length; i++) {
                const { block, type } = tokens[i];

                if (block) {
                    if (type === "code-tabs_tabs_close") {
                        break;
                    }

                    if (type === "tab_close") {
                        inCodeTab = false;
                        continue;
                    }

                    if (type === "tab_open") {
                        // found a code tab
                        inCodeTab = true;
                        foundFence = false;
                        continue;
                    }

                    if (inCodeTab && type === "fence" && !foundFence) {
                        foundFence = true;
                        continue;
                    }

                    tokens[i].type = "code_tab_empty";
                    tokens[i].hidden = true;
                }
            }

            return codeTabsData;
        },
    });
};
