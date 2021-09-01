<center><h1>php&mysql</h1></center>

# 一、 php语法

























# 二、 mysql用法

mysql服务端架构由一下几部分构成：

- 数据库管理系统（最外层）：DBMS，专门管理服务器端的所有内容
- 数据库（第二层）：DB，专门用于储存数据的仓库（可以有多个）
- 二维数据表（第三层）：Table，专门用于储存具体实体的数据
- 字段（第四层）：Field，具体储存某种类型的数据（实际储存单元）

数据库常用的几个关键字：

- row：行
- column：列（field）

## 1. 数据库

### 1.1 创建数据库

语法：

```mysql
create database 数据库名字 [库选项];
```

库选项相关属性：

- 字符集：charset 字符集，代表当前数据库下所有表储存的数据默指定的字符集（如果没有指定，则采取SBMS默认的）
- 校对集：collate 校对集，校对集随字符集

### 1.2 查询数据库

#### 1.2.1 查询所有

```mysql
show databases;
```

#### 1.2.2 查询指定

```mysql
show databases like '匹配模式'
```

匹配模式： 

- _：匹配指定位置多个字符
- %：匹配指定位置多个字符

#### 1.2.3 查看数据库创建语句

```mysql
show create databases 数据库名称
```

### 1.3 选择数据库

```mysql
use 数据库名称
```

### 1.4 修改数据库

```mysql
alter database 数据库名称 charset=gbk
或
alter database 数据库名称 charset utf8
```

### 1.5 删除数据库

```mysql
drop database 数据库名称
```

## 2. 数据表

### 2.1 创建数据表

注：创建表之前必须先进入到这个数据库中

```mysql
create table 表名(字段名 字段类型[字段属性], 字段名 字段类型[字段属性]...) [表选项]
```

































# 三、 php核心技术

