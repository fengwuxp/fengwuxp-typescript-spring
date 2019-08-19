

#### 用于注解增强的相关内容

```
   由于js的装饰器不支持用于函数上，而装饰器本身又是一个函数，所有无法做到类似java中的
   注解叠加的处理，则通过注释的方式进行增强处理
   
   注解增强例子
  
   /**
    *
    * @Retention(RetentionPolicy.SOURCE)
    * @Target(ElementType.ANNOTATION_TYPE)
    */
   export const TestAnnotation=(value:string)=>{
   
   } 
   
   使用注释增加注解，标记注解的作用范围和作用目标
   
```