import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

const dataPath = resolve(process.cwd(), 'src/data/holdings.ts');
const args = new Map();

for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index];
  if (!key.startsWith('--')) continue;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`参数 ${key} 缺少值`);
  args.set(key.slice(2), value);
  index += 1;
}

function required(name) {
  const value = args.get(name);
  if (!value) throw new Error(`缺少 --${name}`);
  return value;
}

function normalizeDate(value) {
  let digits = value.replace(/\D/g, '');
  const currentYear = String(new Date().getFullYear());
  if (digits.length === 8) digits = `${currentYear}${digits}00`;
  else if (digits.length === 10) digits = `${currentYear}${digits}`;
  else if (digits.length === 12) digits = `${digits}00`;
  if (digits.length !== 14) throw new Error('date 支持 MMDDHHmm、MMDDHHmmss、YYYYMMDDHHmm 或 YYYYMMDDHHmmss');
  const normalized = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}:${digits.slice(12, 14)}`;
  if (Number.isNaN(Date.parse(normalized.replace(' ', 'T') + '+08:00'))) throw new Error('date 不是有效时间');
  return normalized;
}

function positiveNumber(name, integer = false) {
  const value = Number(required(name));
  if (!Number.isFinite(value) || value <= 0 || (integer && !Number.isInteger(value))) {
    throw new Error(`${name} 必须是${integer ? '正整数' : '正数'}`);
  }
  return value;
}

function getProperty(object, name) {
  const property = object.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText() === name);
  return property && ts.isPropertyAssignment(property) ? property.initializer : null;
}

function getArray(sourceFile, name) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText() === name && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer;
      }
    }
  }
  throw new Error(`找不到 ${name} 数组`);
}

const code = required('code');
const executedAt = normalizeDate(required('date'));
const price = positiveNumber('price');
const quantity = positiveNumber('quantity', true);
const fee = args.has('fee') ? Number(args.get('fee')) : 5;
const side = args.get('side') ?? '买入';
const tax = args.has('tax') ? Number(args.get('tax')) : undefined;

if (!['买入', '卖出'].includes(side)) throw new Error('side 当前只支持 买入 或 卖出');
if (!Number.isFinite(fee) || fee < 0) throw new Error('fee 必须是非负数');
if (tax !== undefined && (!Number.isFinite(tax) || tax < 0)) throw new Error('tax 必须是非负数');

const source = await readFile(dataPath, 'utf8');
const sourceFile = ts.createSourceFile(dataPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const securitiesArray = getArray(sourceFile, 'securities');
const tradesArray = getArray(sourceFile, 'trades');
let securityId = '';

for (const element of securitiesArray.elements) {
  if (!ts.isObjectLiteralExpression(element)) continue;
  const codeNode = getProperty(element, 'code');
  const idNode = getProperty(element, 'id');
  if (codeNode && idNode && ts.isStringLiteral(codeNode) && ts.isStringLiteral(idNode) && codeNode.text === code) {
    securityId = idNode.text;
    break;
  }
}

if (!securityId) throw new Error(`证券代码 ${code} 不在 securities 中`);

for (const element of tradesArray.elements) {
  if (!ts.isObjectLiteralExpression(element)) continue;
  const dateNode = getProperty(element, 'executedAt');
  const idNode = getProperty(element, 'securityId');
  const quantityNode = getProperty(element, 'quantity');
  const priceNode = getProperty(element, 'price');
  if (
    dateNode && idNode && quantityNode && priceNode &&
    ts.isStringLiteral(dateNode) && ts.isStringLiteral(idNode) &&
    dateNode.text === executedAt && idNode.text === securityId &&
    Number(quantityNode.getText()) === quantity && Number(priceNode.getText()) === price
  ) {
    throw new Error('发现相同时间、证券、数量和价格的交易，已停止以避免重复录入');
  }
}

const amount = Math.round(price * quantity * 100) / 100;
const note = args.get('note');
const lines = [
  '  {',
  `    executedAt: '${executedAt}',`,
  `    securityId: '${securityId}',`,
  `    price: ${price},`,
  `    quantity: ${quantity},`,
  `    amount: ${amount},`,
  `    fee: ${fee},`,
  ...(tax === undefined ? [] : [`    tax: ${tax},`]),
  `    side: '${side}',`,
  ...(note ? [`    note: ${JSON.stringify(note)},`] : []),
  '  },',
];
const insertionPoint = tradesArray.getStart(sourceFile) + 1;
const nextSource = `${source.slice(0, insertionPoint)}\n${lines.join('\n')}${source.slice(insertionPoint)}`;

await writeFile(dataPath, nextSource, 'utf8');
console.log(`${side} ${code}：${quantity} 份 × ${price} = ${amount.toFixed(2)} 元，费用 ${fee.toFixed(2)} 元`);
