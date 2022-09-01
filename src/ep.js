import {
  ElConfigProvider,
  ElButton,
  ElRadio,
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElSelect,
  ElPopconfirm,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElOption,
  ElDatePicker,
  ElTreeV2,
  ElTree,
  ElTabs,
  ElTabPane,
  ElSelectV2,
  ElCheckboxGroup,
  ElIcon,
  ElUpload,
  ElLoading,
  ElImage,
  ElSpace,
  ElButtonGroup,
  ElDialog,
  ElEmpty,
  ElTimeSelect,
  ElAlert,
} from "element-plus";

const compoents = [
  ElConfigProvider,
  ElButtonGroup,
  ElButton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElRadio,
  ElCheckbox,
  ElCheckboxGroup,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElSelect,
  ElSelectV2,
  ElOption,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDatePicker,
  ElTreeV2,
  ElTree,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElUpload,
  ElImage,
  ElSpace,
  ElDialog,
  ElEmpty,
  ElTimeSelect,
  ElAlert,
];

const directive = [ElLoading];

export default {
  install: function (app, opts = {}) {
    compoents.forEach((component) => {
      app.component(component.name, component);
    });

    directive.forEach((d) => {
      app.use(d);
    });
    if (!Object.keys(opts).length) return;
    app.config.globalProperties.$ELEMENT = {
      // options
      ...opts,
    };
  },
};
