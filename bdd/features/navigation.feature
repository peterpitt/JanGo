# language: en
Feature: 步行／自駕導航跟隨使用者真實速度
  As a 旅客
  I want 導航畫面跟著我真實的 GPS 位置與步行速度前進
  so that 我不會「還沒走到」就被系統帶到目的地

  Rule: 導航進度由使用者真實 GPS 位置決定，而非固定時間

    Scenario: 使用者原地不動時，前進進度不變
      Given 一條從起點到終點 400 公尺的步行路線
      And 使用者站在路線起點
      When 使用者的 GPS 位置沒有移動
      Then 導航進度維持在 0 公尺附近
      And 不會自動抵達終點

    Scenario: 使用者沿路線走了一段，進度隨之前進
      Given 一條長度 400 公尺的步行路線
      When 使用者實際走到路線約 120 公尺處
      Then 導航進度約為 120 公尺
      And 顯示的剩餘距離約為 280 公尺

  Rule: GPS 會吸附到規劃路線（Snap-to-Road）

    Scenario: GPS 有約 15 公尺漂移時仍吸附回路線
      Given 一條直線步行路線
      And 一個偏離路線約 15 公尺的 GPS 點
      When 計算吸附位置
      Then 吸附點落在路線上
      And 吸附後的前進進度與實際沿線位置相符

  Rule: 抵達每個景點時只觸發一次抵達事件

    Scenario: 進度到達景點位置時視為抵達
      Given 一條經過景點 S 的路線，且 S 位於路線 250 公尺處
      When 使用者真實進度從 240 公尺前進到 260 公尺
      Then 觸發「抵達 S」事件剛好一次
