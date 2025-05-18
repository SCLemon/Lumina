
import numpy as np
import pickle
import sys
import pandas as pd

import os

def predict_new_data(new_X_raw, model_path):
    # 確認有14天前的資料
    if new_X_raw.shape[0] < 14:
        print('Data less than 14 days')

    # 載入模型
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    # parameters
    k = model["k"]
    train_X = model["train_X"]
    train_y = model["train_y"]
    mu = np.array(model["mu"]).ravel()
    std = np.array(model["std"]).ravel()
    eigvecs = model["eigvecs"]
    sel_idx = model["dsfs_sel"]
    feature_names = model["feature_names"]

    # 取出並排序欄位
    X_raw_ordered = new_X_raw[feature_names].values
    X_sel = X_raw_ordered[:, sel_idx]
    mu_sel = mu[sel_idx]
    std_sel = std[sel_idx]
    X_std = (X_sel - mu_sel) / std_sel

    X_pca = []
    for i, j in enumerate(sel_idx):
        # 取第 i 個特徵（14 天資料）：shape (14,)
        feature_series = X_std[:, i].reshape(1, -1)  # → shape (1, 14)
        eig = eigvecs[j]
        proj = feature_series @ eig  # → shape (1,1)
        X_pca.extend(proj.flatten().tolist())  # 取出 scalar
    
    # KNN predicts
    dists = np.linalg.norm(train_X - X_pca, axis=1)
    nn_idx = np.argpartition(dists, k)[:k]
    votes = train_y[nn_idx]
    proba = votes.mean()
    pred = 1 if proba >= 0.5 else 0
    confidence = round(proba * 100, 2)  # 百分比且保留一位小數

    return f"{pred},{confidence}"


if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        print("參數錯誤")
        sys.exit(1)

    csv_path = sys.argv[1]

    try:
        new_X_raw = pd.read_csv(csv_path)
    except Exception as e:
        print(f"無法讀取檔案: {e}")
        sys.exit(1)

    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, "stock_model.pkl")
    result = predict_new_data(new_X_raw,model_path=model_path)
    
    print(result)