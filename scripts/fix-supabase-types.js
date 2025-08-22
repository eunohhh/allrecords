#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 타입 파일 경로
const typeFilePath = path.join(__dirname, "../src/types/supabase.ts");

// 파일 읽기
let content = fs.readFileSync(typeFilePath, "utf8");

// RecordsEnum 타입 추가 (Json 타입 정의 다음에)
const jsonTypeRegex = /(export type Json =[\s\S]*?\| Json\[\]\n)/;
const enumTypeDefinition =
	'\n// Enum 타입을 먼저 정의하여 자기 참조 문제 해결\nexport type RecordsEnum = "poolsoop" | "ilsang" | "grim"\n';

if (!content.includes("export type RecordsEnum")) {
	content = content.replace(jsonTypeRegex, "$1" + enumTypeDefinition);
}

// Database["public"]["Enums"]["records"]를 RecordsEnum으로 교체
content = content.replace(
	/Database\["public"\]\["Enums"\]\["records"\]/g,
	"RecordsEnum",
);

// 파일 저장
fs.writeFileSync(typeFilePath, content, "utf8");

console.log("✅ Supabase 타입 파일의 자기 참조 문제가 수정되었습니다.");
