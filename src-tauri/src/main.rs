#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

use tauri::Manager;

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // 关闭启动视图
    if let Some(splashscreen) = window.get_window("splashscreen") {
        std::thread::sleep(std::time::Duration::from_secs_f64(1.0));
        splashscreen.close().unwrap();
    }
    // 展示主视图
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
