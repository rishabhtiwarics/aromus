import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../api/client';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';
import './admin.css';

const empty = {
  product: { title: '', slug: '', description: '', gender: 'unisex', category: '', collections: 'unisex', price30: '', originalPrice30: '', stock30: 10, price50: '', originalPrice50: '', stock50: 10, price100: '', originalPrice100: '', stock100: 10, badge: '', images: [], status: 'active', isFeatured: false, isBestSeller: false, isNewArrival: false },
  category: { name: '', slug: '', description: '', image: '', status: 'active', isFeatured: true },
  banner: { title: '', subtitle: '', image: '', buttonText: 'Shop now', buttonLink: '/shop', position: 'homepage', order: 0, status: 'active' },
  settings: { siteName: '', siteDescription: '', logo: '', favicon: '', contactEmail: '', contactPhone: '', address: '', socialLinks: { instagram: '', facebook: '', twitter: '', linkedin: '', youtube: '' } },
};
const nav = [['overview', 'bi-grid', 'Overview'], ['products', 'bi-box-seam', 'Products'], ['categories', 'bi-tags', 'Categories'], ['banners', 'bi-images', 'Banners'], ['orders', 'bi-receipt', 'Orders'], ['contacts', 'bi-envelope', 'Messages'], ['settings', 'bi-gear', 'Settings']];
const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function AdminPage() {
  const [section, setSection] = useState('overview');
  const [data, setData] = useState({ products: [], categories: [], banners: [], orders: [], contacts: [], settings: empty.settings });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      const [products, categories, banners, orders, contacts, settings] = await Promise.all([
        api.get('/product?limit=100&status=active'), api.get('/category'), api.get('/banner'), api.get('/order/admin/all'), api.get('/contact'), api.get('/settings'),
      ]);
      setData({ products: products.data, categories: categories.data, banners: banners.data, orders: orders.data || [], contacts: contacts.data || [], settings: settings.data || empty.settings });
    } catch (error) { setNotice(error.message); }
  }, []);
  useEffect(() => { const id = setTimeout(loadDashboard, 0); return () => clearTimeout(id); }, [loadDashboard]);
  useEffect(() => { document.body.classList.toggle('admin-modal-open', Boolean(modal)); return () => document.body.classList.remove('admin-modal-open'); }, [modal]);

  const openModal = (type, record = null) => {
    let value = record ? { ...record } : structuredClone(empty[type] || {});
    if (type === 'product' && record) {
      const variant = (label) => record.variants?.find((item) => item.label === label) || {};
      value = { ...value, category: record.category?._id || record.category || '', collections: (record.collections || []).join(','), images: record.images || [], price30: variant('30 ml').price || '', originalPrice30: variant('30 ml').originalPrice || '', stock30: variant('30 ml').stock ?? 0, price50: variant('50 ml').price ?? record.salePrice ?? record.price, originalPrice50: variant('50 ml').originalPrice ?? record.price, stock50: variant('50 ml').stock ?? record.stock, price100: variant('100 ml').price || '', originalPrice100: variant('100 ml').originalPrice || '', stock100: variant('100 ml').stock ?? 0 };
    }
    if (type === 'order') value = { ...record, orderStatus: record.orderStatus };
    if (type === 'contact') value = { _id: record._id, status: record.status, name: record.name, message: record.message };
    setForm(value); setModal({ type, editing: Boolean(record), id: record?._id }); setNotice('');
  };
  const closeModal = () => { if (!busy) setModal(null); };
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const upload = async (event, field = 'image') => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); try { const result = await uploadToCloudinary(file, `aromus/${modal.type}`); change(field, result.url); } catch (error) { setNotice(error.message); } finally { setBusy(false); } };
  const uploadProductImages = async (event) => {
    const files = Array.from(event.target.files || []); if (!files.length) return;
    setBusy(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadToCloudinary(file, 'aromus/products')));
      setForm((current) => ({ ...current, images: [...(current.images || []), ...uploaded.map((item) => ({ url: item.url, alt: current.title || 'Product image', position: 'center', isPrimary: false }))].map((image, index) => ({ ...image, isPrimary: index === 0 })) }));
    } catch (error) { setNotice(error.message); } finally { setBusy(false); event.target.value = ''; }
  };
  const removeProductImage = (index) => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index).map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === 0 })) }));
  const makePrimary = (index) => setForm((current) => { const images = [...current.images]; const [selected] = images.splice(index, 1); return { ...current, images: [selected, ...images].map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === 0 })) }; });

  const save = async (event) => {
    event.preventDefault(); setBusy(true); setNotice('');
    try {
      const type = modal.type; let payload = { ...form }; let path = `/${type}`;
      if (type === 'product') {
        if (!form.images?.length) throw new Error('Upload at least one product image.');
        const slug = form.slug || slugify(form.title); const old = data.products.find((item) => item._id === modal.id);
        const variants = ['30','50','100'].filter((size) => form[`price${size}`] !== '').map((size) => { const previous = old?.variants?.find((item) => item.label === `${size} ml`); return { ...(previous?._id ? { _id: previous._id } : {}), label: `${size} ml`, sku: previous?.sku || `${slug.toUpperCase()}-${size}`, price: Number(form[`price${size}`]), originalPrice: Number(form[`originalPrice${size}`] || form[`price${size}`]), stock: Number(form[`stock${size}`]) }; });
        const base = variants.find((item) => item.label === '50 ml') || variants[0];
        payload = { title: form.title, slug, description: form.description, gender: form.gender, category: form.category || undefined, collections: String(form.collections).split(',').map((item) => item.trim()).filter(Boolean), price: base.originalPrice, salePrice: base.price, stock: base.stock, sku: old?.sku || `${slug.toUpperCase()}-BASE`, images: (form.images || []).map((image, index) => ({ url: image.url, alt: image.alt || `${form.title} view ${index + 1}`, position: image.position || 'center', isPrimary: index === 0 })), variants, badge: form.badge, status: form.status, isFeatured: Boolean(form.isFeatured), isBestSeller: Boolean(form.isBestSeller), isNewArrival: Boolean(form.isNewArrival) };
      } else if (type === 'category') payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description, image: form.image, status: form.status, isFeatured: Boolean(form.isFeatured) };
      else if (type === 'banner') payload = { title: form.title, subtitle: form.subtitle, image: form.image, buttonText: form.buttonText, buttonLink: form.buttonLink, position: form.position, order: Number(form.order), status: form.status };
      else if (type === 'settings') {
        path = '/settings';
        payload = Object.fromEntries(Object.entries(form).filter(([key, value]) => !['_id','createdAt','updatedAt','__v','socialLinks'].includes(key) && value !== '' && value != null));
        const socialLinks = Object.fromEntries(Object.entries(form.socialLinks || {}).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]).filter(([, value]) => value));
        if (Object.keys(socialLinks).length) payload.socialLinks = socialLinks;
      }
      else if (type === 'order') { path = `/order/${form._id}/status`; payload = { orderStatus: form.orderStatus, paymentStatus: form.paymentStatus }; }
      else if (type === 'contact') { path = `/contact/${form._id}`; payload = { status: form.status }; }
      if (['settings', 'order', 'contact'].includes(type)) await api.put(path, payload);
      else if (modal.editing) await api.put(`${path}/${modal.id}`, payload);
      else await api.post(path, payload);
      setModal(null); setNotice(`${type[0].toUpperCase()}${type.slice(1)} saved successfully.`); await loadDashboard();
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  const remove = async (resource, id) => { if (!window.confirm(`Permanently delete this ${resource}?`)) return; try { await api.delete(`/${resource}/${id}`); setNotice(`${resource} deleted.`); await loadDashboard(); } catch (error) { setNotice(error.message); } };
  const rows = useMemo(() => {
    const source = data[section];
    if (!Array.isArray(source)) return [];
    const term = query.toLowerCase();
    return source.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  }, [data, query, section]);

  return <main className="admin-shell">
    <aside className="admin-sidebar"><Link className="admin-brand" to="/"><img src="/img/logo.png" alt="" /><span>Aromus<strong>Control room</strong></span></Link><nav>{nav.map(([id, icon, label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setQuery(''); }}><i className={`bi ${icon}`} />{label}</button>)}</nav><Link className="admin-store-link" to="/"><i className="bi bi-arrow-left" /> View storefront</Link></aside>
    <section className="admin-main"><header className="admin-header"><div><small>Website management</small><h1>{nav.find(([id]) => id === section)?.[2]}</h1></div><span className="admin-user"><i className="bi bi-shield-check" /> Administrator</span></header>
      {notice && <div className="admin-notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
      {section === 'overview' ? <Overview data={data} navigate={setSection} /> : section === 'settings' ? <SettingsView settings={data.settings} onEdit={() => openModal('settings', data.settings)} /> : section === 'orders' ? <OrdersView orders={data.orders} query={query} setQuery={setQuery} onView={(record) => openModal('order', record)} /> : <><Toolbar section={section} query={query} setQuery={setQuery} onAdd={['products','categories','banners'].includes(section) ? () => openModal(section.slice(0, -1)) : null} /><ResourceTable section={section} rows={rows} onEdit={(record) => openModal(section === 'products' ? 'product' : section === 'categories' ? 'category' : section === 'banners' ? 'banner' : 'contact', record)} onDelete={['products','categories','banners'].includes(section) ? (id) => remove(section.slice(0, -1), id) : null} /></>}
    </section>
    {modal && <Modal title={`${modal.editing ? 'Edit' : 'Create'} ${modal.type}`} onClose={closeModal}><form className="admin-modal-form" onSubmit={save}>{notice && <div className="admin-modal-error"><i className="bi bi-exclamation-circle" />{notice}</div>}<ModalFields type={modal.type} form={form} change={change} categories={data.categories} upload={upload} uploadProductImages={uploadProductImages} removeProductImage={removeProductImage} makePrimary={makePrimary} busy={busy} /><div className="admin-modal-actions"><button type="button" className="secondary" onClick={closeModal}>Cancel</button><button disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div></form></Modal>}
  </main>;
}

function Overview({ data, navigate }) { const cards = [['products','Products',data.products.length,'bi-box-seam'],['categories','Categories',data.categories.length,'bi-tags'],['orders','Orders',data.orders.length,'bi-receipt'],['contacts','Messages',data.contacts.length,'bi-envelope']]; return <><div className="admin-stats">{cards.map(([id,label,value,icon]) => <button key={id} onClick={() => navigate(id)}><i className={`bi ${icon}`} /><span>{label}</span><strong>{value}</strong><small>Manage <i className="bi bi-arrow-up-right" /></small></button>)}</div><div className="admin-welcome"><span><i className="bi bi-stars" /></span><div><small>Aromus administration</small><h2>Everything your storefront needs, in one place.</h2><p>Keep the catalogue fresh, publish campaign artwork, monitor orders, and respond to customer enquiries.</p></div></div></>; }
function Toolbar({ section, query, setQuery, onAdd }) { return <div className="admin-toolbar"><label><i className="bi bi-search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${section}`} /></label>{onAdd && <button onClick={onAdd}><i className="bi bi-plus-lg" /> Add {section.slice(0,-1)}</button>}</div>; }
function OrdersView({ orders, query, setQuery, onView }) {
  const [status, setStatus] = useState('all');
  const filtered = useMemo(() => { const term = query.toLowerCase(); return orders.filter((order) => (status === 'all' || order.orderStatus === status || order.paymentStatus === status) && JSON.stringify(order).toLowerCase().includes(term)); }, [orders, query, status]);
  const revenue = orders.filter((order) => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.totalAmount, 0);
  const pending = orders.filter((order) => order.orderStatus === 'pending').length;
  const processing = orders.filter((order) => ['confirmed','processing'].includes(order.orderStatus)).length;
  const formatMoney = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
  const filters = ['all','pending','processing','shipped','delivered','paid','failed'];
  return <div className="admin-orders-page">
    <div className="admin-order-metrics"><article><span><i className="bi bi-bag-check" /></span><div><small>Total orders</small><strong>{orders.length}</strong></div></article><article><span><i className="bi bi-hourglass-split" /></span><div><small>Awaiting action</small><strong>{pending}</strong></div></article><article><span><i className="bi bi-box-seam" /></span><div><small>In progress</small><strong>{processing}</strong></div></article><article><span><i className="bi bi-currency-rupee" /></span><div><small>Paid revenue</small><strong>{formatMoney(revenue)}</strong></div></article></div>
    <div className="admin-orders-controls"><label><i className="bi bi-search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, customer, email or SKU" /></label><div>{filters.map((item) => <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}<span>{item === 'all' ? orders.length : orders.filter((order) => order.orderStatus === item || order.paymentStatus === item).length}</span></button>)}</div></div>
    <div className="admin-orders-list"><div className="admin-orders-list-head"><span>Order</span><span>Customer</span><span>Items</span><span>Payment</span><span>Fulfillment</span><span>Total</span><span /></div>{filtered.map((order) => { const customer = order.user || {}; return <article key={order._id}><div className="admin-order-id"><strong>#{String(order._id).slice(-8).toUpperCase()}</strong><span>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></div><div className="admin-order-customer"><span>{(customer.firstName || customer.email || 'C').charAt(0).toUpperCase()}</span><div><strong>{[customer.firstName,customer.lastName].filter(Boolean).join(' ') || 'Customer'}</strong><small>{customer.email || 'No email'}</small></div></div><div className="admin-order-products"><strong>{order.items?.reduce((sum,item) => sum + item.quantity, 0) || 0} items</strong><span>{order.items?.[0]?.title || 'No items'}{order.items?.length > 1 ? ` +${order.items.length - 1}` : ''}</span></div><div><span className={`admin-order-pill payment ${order.paymentStatus}`}>{order.paymentStatus}</span><small>{String(order.paymentMethod).toUpperCase()}</small></div><span className={`admin-order-pill ${order.orderStatus}`}>{order.orderStatus}</span><strong className="admin-order-total">{formatMoney(order.totalAmount)}</strong><button className="admin-order-view" onClick={() => onView(order)}><i className="bi bi-eye" /><span>View</span></button></article>; })}{!filtered.length && <div className="admin-orders-empty"><i className="bi bi-receipt" /><h3>No matching orders</h3><p>Try a different search term or status filter.</p></div>}</div>
  </div>;
}
function SettingsView({ settings, onEdit }) {
  const socials = Object.entries(settings.socialLinks || {}).filter(([, value]) => value);
  return <div className="admin-settings-layout">
    <section className="admin-settings-hero"><div className="admin-settings-logo">{settings.logo ? <img src={settings.logo} alt={settings.siteName || 'Site logo'} /> : <i className="bi bi-stars" />}</div><div><small>Storefront identity</small><h2>{settings.siteName || 'Aromus Parfum'}</h2><p>{settings.siteDescription || 'Add a public description for your fragrance house.'}</p></div><button onClick={onEdit}><i className="bi bi-pencil" /> Edit settings</button></section>
    <div className="admin-settings-grid"><article><span><i className="bi bi-envelope" /></span><small>Contact email</small><strong>{settings.contactEmail || 'Not configured'}</strong></article><article><span><i className="bi bi-telephone" /></span><small>Contact phone</small><strong>{settings.contactPhone || 'Not configured'}</strong></article><article><span><i className="bi bi-geo-alt" /></span><small>Business address</small><strong>{settings.address || 'Not configured'}</strong></article></div>
    <section className="admin-settings-assets"><div><small>Brand assets</small><h3>Logo and browser icon</h3></div><div className="admin-asset-preview"><figure>{settings.logo ? <img src={settings.logo} alt="Site logo" /> : <i className="bi bi-image" />}<figcaption>Primary logo</figcaption></figure><figure>{settings.favicon ? <img src={settings.favicon} alt="Favicon" /> : <i className="bi bi-app" />}<figcaption>Favicon</figcaption></figure></div></section>
    <section className="admin-settings-social"><div><small>Connected channels</small><h3>Social profiles</h3></div><div>{socials.length ? socials.map(([network, url]) => <a key={network} href={url} target="_blank" rel="noreferrer"><i className={`bi bi-${network === 'twitter' ? 'twitter-x' : network}`} /><span>{network}</span><i className="bi bi-arrow-up-right" /></a>) : <p>No social profiles configured.</p>}</div></section>
  </div>;
}

const columns = { products: [['title','Product'],['category.name','Category'],['salePrice','Price'],['stock','Stock'],['status','Status']], categories: [['name','Category'],['slug','Slug'],['status','Status']], banners: [['title','Campaign'],['position','Placement'],['order','Order'],['status','Status']], orders: [['_id','Order'],['user.email','Customer'],['totalAmount','Total'],['paymentStatus','Payment'],['orderStatus','Status'],['createdAt','Placed']], contacts: [['name','Customer'],['email','Email'],['subject','Subject'],['status','Status']] };
const get = (row, path) => path.split('.').reduce((value, key) => value?.[key], row);
function ResourceTable({ section, rows, onEdit, onDelete }) { return <div className="admin-table-wrap"><table><thead><tr>{columns[section].map(([,label]) => <th key={label}>{label}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row._id}>{columns[section].map(([path]) => <td key={path}>{['salePrice','totalAmount'].includes(path) ? `₹${get(row,path) ?? 0}` : path === 'createdAt' ? new Date(get(row,path)).toLocaleString('en-IN') : String(get(row,path) ?? '—')}</td>)}<td><div className="admin-row-actions"><button title={section === 'orders' ? 'View order details' : 'Edit'} onClick={() => onEdit(row)}><i className={`bi ${section === 'orders' ? 'bi-eye' : 'bi-pencil'}`} /></button>{onDelete && <button className="danger" title="Delete" onClick={() => onDelete(row._id)}><i className="bi bi-trash" /></button>}</div></td></tr>)}</tbody></table>{!rows.length && <div className="admin-empty"><i className="bi bi-inbox" /><strong>No records found</strong><span>Try changing your search or create a new record.</span></div>}</div>; }
function Modal({ title, onClose, children }) { return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-label={title}><header><div><small>Aromus control room</small><h2>{title}</h2></div><button onClick={onClose}><i className="bi bi-x-lg" /></button></header>{children}</section></div>; }

function ModalFields({ type, form, change, categories, upload, uploadProductImages, removeProductImage, makePrimary, busy }) {
  if (type === 'order') return <OrderDetails order={form} change={change} />;
  if (type === 'contact') return <><div className="admin-message-preview"><strong>{form.name}</strong><p>{form.message}</p></div><Field label="Message status"><select value={form.status} onChange={(e) => change('status', e.target.value)}>{['new','contacted','closed'].map((v) => <option key={v}>{v}</option>)}</select></Field></>;
  if (type === 'settings') return <div className="admin-field-grid"><div className="admin-modal-section-title"><i className="bi bi-type" /><div><strong>Brand identity</strong><small>Public naming and description</small></div></div><Field label="Site name"><input value={form.siteName || ''} onChange={(e) => change('siteName', e.target.value)} /></Field><Field wide label="Site description"><textarea value={form.siteDescription || ''} onChange={(e) => change('siteDescription', e.target.value)} /></Field><div className="admin-modal-section-title"><i className="bi bi-headset" /><div><strong>Contact information</strong><small>Details visible to customers</small></div></div><Field label="Contact email"><input type="email" value={form.contactEmail || ''} onChange={(e) => change('contactEmail', e.target.value)} /></Field><Field label="Contact phone"><input value={form.contactPhone || ''} onChange={(e) => change('contactPhone', e.target.value)} /></Field><Field wide label="Address"><input value={form.address || ''} onChange={(e) => change('address', e.target.value)} /></Field><div className="admin-modal-section-title"><i className="bi bi-share" /><div><strong>Social profiles</strong><small>Use complete https:// URLs</small></div></div>{['instagram','facebook','twitter','linkedin','youtube'].map((network) => <Field key={network} label={`${network} URL`}><input type="url" value={form.socialLinks?.[network] || ''} onChange={(e) => change('socialLinks', { ...(form.socialLinks || {}), [network]: e.target.value })} /></Field>)}<div className="admin-modal-section-title"><i className="bi bi-palette" /><div><strong>Brand assets</strong><small>Images are uploaded to Cloudinary</small></div></div><ImageUpload label="Site logo" url={form.logo} onChange={(e) => upload(e, 'logo')} busy={busy} /><ImageUpload label="Favicon" url={form.favicon} onChange={(e) => upload(e, 'favicon')} busy={busy} /></div>;
  return <div className="admin-field-grid">
    <Field label={type === 'product' ? 'Product title' : type === 'category' ? 'Category name' : 'Banner title'}><input required value={form.title ?? form.name ?? ''} onChange={(e) => change(type === 'category' ? 'name' : 'title', e.target.value)} /></Field>
    {type !== 'banner' && <Field label="Slug"><input value={form.slug || ''} onChange={(e) => change('slug', e.target.value)} placeholder="Generated automatically" /></Field>}
    {type === 'product' && <><Field wide label="Description"><textarea value={form.description || ''} onChange={(e) => change('description', e.target.value)} /></Field><Field label="Category"><select value={form.category || ''} onChange={(e) => change('category', e.target.value)}><option value="">Uncategorized</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></Field><Field label="Gender"><select value={form.gender} onChange={(e) => change('gender', e.target.value)}><option>male</option><option>female</option><option>unisex</option></select></Field><Field label="Collections"><input value={form.collections || ''} onChange={(e) => change('collections', e.target.value)} /></Field><Field label="Badge"><input value={form.badge || ''} onChange={(e) => change('badge', e.target.value)} /></Field><div className="admin-variant-editor"><h3>Bottle variants</h3>{['30','50','100'].map((size) => <div key={size}><strong>{size} ml</strong><input required={size === '50'} min="0" type="number" placeholder="Price" value={form[`price${size}`]} onChange={(e) => change(`price${size}`, e.target.value)} /><input min="0" type="number" placeholder="Original price" value={form[`originalPrice${size}`]} onChange={(e) => change(`originalPrice${size}`, e.target.value)} /><input min="0" type="number" placeholder="Stock" value={form[`stock${size}`]} onChange={(e) => change(`stock${size}`, e.target.value)} /></div>)}</div></>}
    {type === 'category' && <Field wide label="Description"><textarea value={form.description || ''} onChange={(e) => change('description', e.target.value)} /></Field>}
    {type === 'banner' && <><Field wide label="Subtitle"><textarea value={form.subtitle || ''} onChange={(e) => change('subtitle', e.target.value)} /></Field><Field label="Button text"><input value={form.buttonText || ''} onChange={(e) => change('buttonText', e.target.value)} /></Field><Field label="Button link"><input value={form.buttonLink || ''} onChange={(e) => change('buttonLink', e.target.value)} /></Field><Field label="Placement"><select value={form.position} onChange={(e) => change('position', e.target.value)}>{['homepage','category','sidebar','popup'].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Display order"><input type="number" value={form.order} onChange={(e) => change('order', e.target.value)} /></Field></>}
    <Field label="Status"><select value={form.status} onChange={(e) => change('status', e.target.value)}>{(type === 'product' ? ['active','draft'] : ['active','inactive']).map((v) => <option key={v}>{v}</option>)}</select></Field>
    {type === 'product' ? <ProductGalleryInput images={form.images || []} onUpload={uploadProductImages} onRemove={removeProductImage} onPrimary={makePrimary} busy={busy} /> : <ImageUpload label={`${type} image`} url={form.image} onChange={upload} busy={busy} />}
    {type === 'product' && <div className="admin-toggle-row">{[['isFeatured','Featured'],['isBestSeller','Best seller'],['isNewArrival','New arrival']].map(([key,label]) => <label key={key}><input type="checkbox" checked={Boolean(form[key])} onChange={(e) => change(key, e.target.checked)} /><span />{label}</label>)}</div>}
  </div>;
}
function Field({ label, wide, children }) { return <label className={`admin-field${wide ? ' wide' : ''}`}><span>{label}</span>{children}</label>; }
function ImageUpload({ label, url, onChange, busy }) { return <label className="admin-image-field"><span>{label}</span><div>{url ? <img src={url} alt="Upload preview" /> : <i className="bi bi-cloud-arrow-up" />}<strong>{busy ? 'Uploading…' : url ? 'Replace image' : 'Choose image'}</strong></div><input type="file" accept="image/*" onChange={onChange} disabled={busy} /></label>; }
function ProductGalleryInput({ images, onUpload, onRemove, onPrimary, busy }) { return <div className="admin-gallery-field"><div className="admin-gallery-heading"><div><span>Product gallery</span><small>The first image is used as the primary storefront image.</small></div><label><i className="bi bi-cloud-arrow-up" />{busy ? 'Uploading…' : 'Add images'}<input type="file" accept="image/*" multiple onChange={onUpload} disabled={busy} /></label></div><div className="admin-gallery-grid">{images.map((image, index) => <article key={`${image.url}-${index}`} className={index === 0 ? 'primary' : ''}><img src={image.url} alt={image.alt || `Product view ${index + 1}`} /><span>{index === 0 ? 'Primary' : `View ${index + 1}`}</span><div>{index !== 0 && <button type="button" title="Make primary" onClick={() => onPrimary(index)}><i className="bi bi-star" /></button>}<button type="button" title="Remove image" onClick={() => onRemove(index)}><i className="bi bi-trash" /></button></div></article>)}{!images.length && <p>No product images uploaded yet.</p>}</div></div>; }
function OrderDetails({ order, change }) {
  const address = order.shippingAddress || {}; const customer = order.user || {};
  return <div className="admin-order-details">
    <div className="admin-order-summary-head"><div><small>Order ID</small><strong>{order._id}</strong><span>Placed {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}</span></div><div><span className={`admin-status ${order.paymentStatus}`}>{order.paymentStatus}</span><span className={`admin-status ${order.orderStatus}`}>{order.orderStatus}</span></div></div>
    <div className="admin-order-info-grid"><article><i className="bi bi-person" /><div><small>Customer</small><strong>{[customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer'}</strong><span>{customer.email || 'No email available'}{customer.phone ? ` · ${customer.phone}` : ''}</span></div></article><article><i className="bi bi-geo-alt" /><div><small>Shipping address</small><strong>{address.addressLine1 || 'Not provided'}</strong><span>{[address.addressLine2,address.city,address.state,address.pinCode,address.country].filter(Boolean).join(', ')}</span></div></article><article><i className="bi bi-credit-card" /><div><small>Payment</small><strong>{String(order.paymentMethod || '').toUpperCase()}</strong><span>{order.razorpayPaymentId || (order.paymentMethod === 'cod' ? 'Collect on delivery' : 'Pending payment')}</span></div></article></div>
    <section className="admin-order-items"><div className="admin-order-section-title"><span>Items</span><small>{order.items?.length || 0} line items</small></div>{(order.items || []).map((item, index) => <article key={`${item.product?._id || item.product}-${index}`}><div className="admin-order-item-image">{item.image ? <img src={item.image} alt={item.title} /> : <i className="bi bi-box" />}</div><div><strong>{item.title}</strong><span>{item.size} · {item.sku}</span></div><span>{item.quantity} × ₹{item.price}</span><strong>₹{item.quantity * item.price}</strong></article>)}</section>
    <div className="admin-order-bottom"><div className="admin-order-totals"><p><span>Subtotal</span><strong>₹{order.subTotal || 0}</strong></p><p><span>GST ({order.taxRate ?? 18}%)</span><strong>₹{order.gstAmount || 0}</strong></p><p><span>Shipping</span><strong>₹{order.shippingCharge || 0}</strong></p><p><span>Total</span><strong>₹{order.totalAmount || 0}</strong></p></div><div className="admin-order-controls"><Field label="Fulfillment status"><select value={order.orderStatus} onChange={(e) => change('orderStatus', e.target.value)}>{['pending','confirmed','processing','shipped','delivered','cancelled'].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Payment status"><select value={order.paymentStatus} onChange={(e) => change('paymentStatus', e.target.value)}>{['pending','paid','failed','refunded'].map((v) => <option key={v}>{v}</option>)}</select></Field></div></div>
    {(order.razorpayOrderId || order.razorpayPaymentId) && <div className="admin-payment-ids"><span>Razorpay order: <strong>{order.razorpayOrderId || '—'}</strong></span><span>Payment: <strong>{order.razorpayPaymentId || 'Pending'}</strong></span>{order.paidAt && <span>Paid: <strong>{new Date(order.paidAt).toLocaleString('en-IN')}</strong></span>}</div>}
  </div>;
}
