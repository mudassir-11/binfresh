import * as React from "react";
import { supabase } from "../lib/supabase";
import { Loader2, Users, Calendar, Repeat, LogOut, Search, Star, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export function AdminPortal() {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Login state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");

  // Data state
  const [activeTab, setActiveTab] = React.useState<"overview" | "customers" | "subscriptions" | "bookings" | "reviews">("overview");
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<any[]>([]);
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  React.useEffect(() => {
    if (!supabase) {
      setAuthError("Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel.");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchData();
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (!supabase) return;

      const [custRes, subRes, bookRes, reviewRes] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('*, customers(first_name, last_name, email, phone)').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, customers(first_name, last_name, email, phone)').order('service_date', { ascending: true }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false })
      ]);

      setCustomers(custRes.data || []);
      setSubscriptions(subRes.data || []);
      setBookings(bookRes.data || []);
      setReviews(reviewRes.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!supabase) return;
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (!error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    } else {
      alert("Failed to update review status: " + error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!supabase) return setAuthError("Supabase not configured");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground text-sm">Secure access for CleanBinSolutions</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CleanBinSolutions Admin</h1>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500">
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-8">
        
        {/* Sidebar */}
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="w-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customers' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users size={18} /> Customers <span className="ml-auto text-xs opacity-70">{customers.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Repeat size={18} /> Subscriptions <span className="ml-auto text-xs opacity-70">{subscriptions.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Calendar size={18} /> One-Time Bookings <span className="ml-auto text-xs opacity-70">{bookings.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Star size={18} /> Reviews <span className="ml-auto text-xs opacity-70">{reviews.length}</span>
          </button>
        </nav>

        {/* Main Content */}
        <main className="bg-white rounded-xl border shadow-sm p-6 min-h-[600px]">
          {dataLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="animate-spin mb-4" size={32} />
              Loading data...
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                      <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">Total Customers</p>
                      <p className="text-4xl font-extrabold">{customers.length}</p>
                    </div>
                    <div className="p-6 bg-green-50 text-green-900 rounded-xl border border-green-100">
                      <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">Active Subscriptions</p>
                      <p className="text-4xl font-extrabold">{subscriptions.filter(s => s.status === 'active').length}</p>
                    </div>
                    <div className="p-6 bg-purple-50 text-purple-900 rounded-xl border border-purple-100">
                      <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">One-Time Bookings</p>
                      <p className="text-4xl font-extrabold">{bookings.length}</p>
                    </div>
                    <div className="p-6 bg-amber-50 text-amber-900 rounded-xl border border-amber-100">
                      <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">Pending Reviews</p>
                      <p className="text-4xl font-extrabold">{reviews.filter(r => r.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "customers" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Customers</h2>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input placeholder="Search..." className="pl-9" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Contact</th>
                          <th className="px-4 py-3 font-medium">Address</th>
                          <th className="px-4 py-3 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {customers.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{c.first_name} {c.last_name}</td>
                            <td className="px-4 py-3">
                              <div>{c.email}</div>
                              <div className="text-xs text-muted-foreground">{c.phone}</div>
                            </td>
                            <td className="px-4 py-3">{c.address}, {c.city} {c.zip_code}</td>
                            <td className="px-4 py-3 text-muted-foreground">{format(new Date(c.created_at), 'MMM d, yyyy')}</td>
                          </tr>
                        ))}
                        {customers.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No customers found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "subscriptions" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 font-medium">Customer</th>
                          <th className="px-4 py-3 font-medium">Plan</th>
                          <th className="px-4 py-3 font-medium">Details</th>
                          <th className="px-4 py-3 font-medium">Next Service</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {subscriptions.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">{s.customers?.first_name} {s.customers?.last_name}</div>
                              <div className="text-xs text-muted-foreground">{s.customers?.phone}</div>
                            </td>
                            <td className="px-4 py-3 font-medium">{s.plan_name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{s.bin_count} Bins · {s.scent} Scent</td>
                            <td className="px-4 py-3">{s.next_service_date ? format(new Date(s.next_service_date), 'MMM d, yyyy') : '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                s.status === 'active' ? 'bg-green-100 text-green-700' :
                                s.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {subscriptions.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No subscriptions found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">One-Time Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 font-medium">Customer</th>
                          <th className="px-4 py-3 font-medium">Service Date</th>
                          <th className="px-4 py-3 font-medium">Details</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {bookings.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">{b.customers?.first_name} {b.customers?.last_name}</div>
                              <div className="text-xs text-muted-foreground">{b.customers?.phone}</div>
                            </td>
                            <td className="px-4 py-3">{b.service_date ? format(new Date(b.service_date), 'MMM d, yyyy') : '-'}</td>
                            <td className="px-4 py-3 text-muted-foreground">{b.bin_count} Bins · {b.scent} Scent</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                b.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No bookings found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground border rounded-xl bg-slate-50">
                        No reviews yet.
                      </div>
                    ) : (
                      reviews.map(r => (
                        <div key={r.id} className="border rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6">
                          {r.photo_url && (
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img src={r.photo_url} alt="Review" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{r.customer_name}</h3>
                                <div className="text-sm text-muted-foreground">{format(new Date(r.created_at), 'MMM d, yyyy')}</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                r.status === 'approved' ? 'bg-green-100 text-green-700' :
                                r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {r.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <p className="text-slate-700 italic">"{r.comment}"</p>
                          </div>
                          
                          {r.status === 'pending' && (
                            <div className="flex flex-row md:flex-col gap-2 justify-center md:border-l md:pl-6 pt-4 md:pt-0">
                              <Button 
                                onClick={() => handleUpdateReviewStatus(r.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700" size="sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                              </Button>
                              <Button 
                                onClick={() => handleUpdateReviewStatus(r.id, 'rejected')}
                                variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" size="sm"
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
