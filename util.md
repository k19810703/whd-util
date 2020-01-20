## Functions

<dl>
<dt><a href="#generateUKey">generateUKey(length)</a></dt>
<dd><p>生成一个包含英数字的随机字符串</p>
</dd>
<dt><a href="#checkPathExist">checkPathExist(checkpath)</a></dt>
<dd><p>检查目录是否存在</p>
</dd>
<dt><a href="#deleteFile">deleteFile(pathToBeDel)</a></dt>
<dd><p>删除指定文件，若文件不存在报错</p>
</dd>
<dt><a href="#loadJSONFile">loadJSONFile(jsonfilepath)</a></dt>
<dd><p>读取指定json文件</p>
</dd>
<dt><a href="#createFolderWhenNotExist">createFolderWhenNotExist(folder)</a></dt>
<dd><p>创建目录，若目录不存在则创建，若存在则结束</p>
</dd>
<dt><a href="#loadCSVFIle">loadCSVFIle(csvFilePath, [encode])</a></dt>
<dd><p>读入CSV文件</p>
</dd>
</dl>

<a name="generateUKey"></a>

## generateUKey(length)
生成一个包含英数字的随机字符串

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| length | <code>string</code> | <code>8</code> | 字符串长度 |

<a name="checkPathExist"></a>

## checkPathExist(checkpath)
检查目录是否存在

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| checkpath | <code>string</code> | 目录路径 |

<a name="deleteFile"></a>

## deleteFile(pathToBeDel)
删除指定文件，若文件不存在报错

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| pathToBeDel | <code>string</code> | 待删除文件路径 |

<a name="loadJSONFile"></a>

## loadJSONFile(jsonfilepath)
读取指定json文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| jsonfilepath | <code>string</code> | json文件路径 |

<a name="createFolderWhenNotExist"></a>

## createFolderWhenNotExist(folder)
创建目录，若目录不存在则创建，若存在则结束

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | 待创建目录路径 |

<a name="loadCSVFIle"></a>

## loadCSVFIle(csvFilePath, [encode])
读入CSV文件

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| csvFilePath | <code>string</code> |  | 待创建目录路径 |
| [encode] | <code>encode</code> | <code>utf-8</code> | 文件编码 |

