import { useMemo, useState } from 'react'
import { APP_NAME } from '../../shared/app-meta'

const modules = [
  {
    key: 'compliance',
    name: '合规中心',
    icon: 'dashboard',
    subtitle: '商品合规信息、合规中心商品池与批量任务入口',
  },
  {
    key: 'pricing',
    name: '上新调价',
    icon: 'inventory_2',
    subtitle: '调价单、模板与提交确认流程',
  },
  {
    key: 'goods',
    name: '商品列表',
    icon: 'sell',
    subtitle: '商品池、列表维护与库存相关操作',
  },
  {
    key: 'declaration',
    name: '申报核价',
    icon: 'query_stats',
    subtitle: '价格申报、核价和部分提交任务',
  },
  {
    key: 'product-launch',
    name: '产品加站',
    icon: 'rocket_launch',
    subtitle: '快速筛选、确认与提交流程',
  },
  {
    key: 'shop',
    name: '店铺管理',
    icon: 'storefront',
    subtitle: '店铺与基础配置入口',
  },
] as const

export default function App() {
  const [activeKey, setActiveKey] = useState(modules[0].key)
  const activeModule = useMemo(
    () => modules.find((item) => item.key === activeKey) ?? modules[0],
    [activeKey],
  )

  return (
    <div className="desktop-shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-title">接口文档</div>
          <div className="sidebar-subtitle">{APP_NAME}</div>
        </div>

        <nav className="sidebar-nav" aria-label="模块导航">
          {modules.map((item) => {
            const active = item.key === activeKey
            return (
              <button
                key={item.key}
                type="button"
                className={`nav-item${active ? ' is-active' : ''}`}
                onClick={() => setActiveKey(item.key)}
              >
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-foot">当前页：{modules[0].name}</div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">Temu Auto System</div>
            <h1>{activeModule.name}</h1>
          </div>
          <div className="status-pill">
            <span className="status-dot" />
            正在施工中
          </div>
        </header>

        <section className="hero-band">
          <div className="hero-copy">
            <p className="hero-kicker">当前模块</p>
            <h2>{activeModule.name}</h2>
            <p className="hero-desc">{activeModule.subtitle}</p>
          </div>
          <div className="hero-card">
            <div className="hero-card-title">施工提示</div>
            <div className="hero-card-body">
              先把桌面端壳子立住，后续再逐个模块接入真实接口与操作流。
            </div>
          </div>
        </section>

        <section className="content-band">
          <div className="section-head">
            <div>
              <div className="section-title">模块内容</div>
              <div className="section-subtitle">点击左侧模块会切换到对应占位页。</div>
            </div>
          </div>

          <div className="work-card">
            <div className="work-card-title">{activeModule.name}</div>
            <div className="work-card-status">正在施工中</div>
            <div className="work-card-copy">
              这里后续会承载该模块的列表、筛选、批量操作与详情面板。
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
