import { Item, Items, Properties } from "./types";

function createFieldWithLayout(
  layouts: Record<string, Properties>,
  schema: any
) {
  Object.keys(layouts).forEach((key) => {
    if (Array.isArray(layouts[key].properties)) {
      // TODO: 如果是 array 的话，替换
      const tmp: Record<string, any> = {};
      (layouts[key].properties as [string]).forEach((element) => {
        tmp[element] = schema[element];
      });
      // eslint-disable-next-line no-param-reassign
      layouts[key].properties = tmp;
    } else {
      // TODO: 递归
      // eslint-disable-next-line no-param-reassign
      layouts[key].properties = createFieldWithLayout(
        layouts[key].properties as Record<string, Properties>,
        schema
      );
    }
  });
  // TODO: 返回修改的 layouts
  return layouts;
}

// 实体规格类，用于生成表格，表单，详情页
export class EntitySpec {
  /**
   * 用于表单布局的 schema 描述
   */
  public formLayoutSchema: Record<string, any> = {};
  private items: Items;

  public constructor(items: Items) {
    this.items = items;
  }

  /**
   * @param key 某个字段
   * @param itemKey 属性
   * @param modify 修饰函数
   */
  public modifyItem(key: string, itemKey: "render" | "name", modify: Function) {
    // @ts-ignore
    this.items[key][itemKey] = modify;
    return this; // 链式调用
  }

  /**
   * 添加字段
   * @param data 描述对象
   */
  public addItem(key: string, data: Item) {
    this.items[key] = data;
    return this;
  }

  /**
   * @param key 修饰的字段
   * @param itemKey
   */
  public modifyTableItem(key: string, itemKey: string, modify: () => any) {
    this.items[key].tableProps[itemKey] = modify();
    return this; // 链式调用
  }

  /**
   * @description 修改布局
   */
  public modifyFormLayout(layouts: Record<string, any>) {
    this.formLayoutSchema = layouts;
    return this; // 链式调用
  }

  /**
   * 返回表格的描述 schema
   */
  public getTableSchema() {
    const columns: Record<string, any>[] = [];
    Object.keys(this.items).forEach((key) => {
      const item = this.items[key];
      if (item.use.indexOf("table") > -1) {
        const column = {
          title: item.name,
          dataIndex: item.key,
          ...item.tableProps,
        };
        if (item.render) {
          column.render = item.render;
        }
        columns.push(column);
      }
    });
    return columns;
  }

  /**
   * 返回详情的描述 schema
   */
  public getDescriptionSchema() {
    const descriptions: Record<string, any>[] = [];
    Object.keys(this.items).forEach((key) => {
      const item = this.items[key];
      if (item.use.indexOf("description") > -1) {
        const column = {
          label: item.name,
          dataIndex: item.key,
          // render: item.render,
          ...item.descriptionProps,
        };
        if (item.render) {
          column.render = item.render;
        }
        descriptions.push(column);
      }
    });
    return descriptions;
  }

  /**
   * 返回表单数据的描述 schema
   */
  public getFormSchema() {
    const schema: Record<string, any> = {};
    Object.keys(this.items).forEach((key) => {
      const item = this.items[key];
      if (item.use.indexOf("form") > -1) {
        const field = {
          title: item.name,
          ...item.formProps,
        };
        schema[key] = field;
      }
    });
    // TODO: 检查是否有 layout 设置
    if (Object.keys(this.formLayoutSchema).length > 0) {
      const witchLayoutSchema = createFieldWithLayout(
        this.formLayoutSchema,
        schema
      );
      return {
        type: "object",
        properties: witchLayoutSchema,
      };
    }
    return {
      type: "object",
      properties: schema,
    };
  }
}
