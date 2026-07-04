import { APP_NAME } from '../../shared/app-meta'

export default function App() {
  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">{APP_NAME}</p>
        <h1>Electron + Vite + React + TypeScript</h1>
        <p className="desc">
          这是一个标准三层目录的基础模板，后续可以继续接入合规、调价、库存、核价和加站模块。
        </p>
      </section>
    </main>
  )
}
