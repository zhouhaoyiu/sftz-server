import { customerInput } from '../src/customer';
const input={userHh:'001',userName:'演示用户',userAddress:'演示地址',lastNumber:100,currentNumber:120,userPopulation:3,waterClassification:[]};
test('accepts zero readings and removes unknown writable fields',()=>{expect(customerInput({...input,lastNumber:0,currentNumber:0,admin:true,userId:100})).not.toHaveProperty('userId');});
test('requires identity and does not convert empty readings to zero',()=>{expect(()=>customerInput({...input,lastNumber:''})).toThrow();expect(()=>customerInput({...input,userHh:''})).toThrow();});
test('rejects malformed classifications and backwards readings',()=>{expect(()=>customerInput({...input,currentNumber:1})).toThrow();expect(()=>customerInput({...input,waterClassification:[{waterType:'unknown',waterNumber:1}]})).toThrow();});
