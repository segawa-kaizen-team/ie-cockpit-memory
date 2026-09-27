"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    theme: "",
    category: "生産性",
    status: "未確認",
    memo: "",
  });

  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("読み込み中...");

  async function loadRecords() {
    try {
      const response = await fetch("/api/themes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("読み込みに失敗しました");
      }

      const data = await response.json();
      setRecords(data);
      setMessage(
        data.length > 0
          ? `${data.length}件の改善テーマを読み込みました`
          : "保存済みの改善テーマはありません"
      );
    } catch {
      setMessage("データベース接続後に保存データを表示します");
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveTheme(event) {
    event.preventDefault();

    if (!form.theme.trim()) {
      setMessage("改善テーマを入力してください");
      return;
    }

    setMessage("保存中...");

    try {
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("保存に失敗しました");
      }

      setForm({
        theme: "",
        category: "生産性",
        status: "未確認",
        memo: "",
      });

      setMessage("Neonへ保存しました");
      await loadRecords();
    } catch {
      setMessage("保存できませんでした。データベース設定を確認してください");
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            4か月目課題｜自分の画面に記憶を持たせる
          </p>
          <h1 style={styles.title}>IE改善コックピット</h1>
          <p style={styles.subtitle}>
            改善テーマをNeonへ保存し、リロード後も記憶を保持
          </p>
        </div>

        <div style={styles.status}>
          <span style={styles.statusDot}>●</span>
          Vercel公開用
        </div>
      </section>

      <section 
