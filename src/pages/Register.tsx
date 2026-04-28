import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm p-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Konto erstellen</h1>
        <p className="text-muted-foreground text-sm">
          Erstellen Sie ein neues Konto für Ihren Verein
        </p>
      </div>
      <form onSubmit={handleRegister} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Vollständiger Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Max Mustermann"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-destructive text-sm font-medium">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Lädt...' : 'Registrieren'}
        </Button>
      </form>
      <div className="text-center text-sm">
        Haben Sie bereits ein Konto?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Anmelden
        </Link>
      </div>
    </div>
  );
}
