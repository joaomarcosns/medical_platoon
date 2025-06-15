import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { z } from 'zod';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

// Schema de validação com Zod
const registerSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    role: z.enum(['doctor', 'hospital_admin']),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'As senhas não coincidem',
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
    const { data, setData, post, processing, errors, reset, setError } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        role: 'doctor',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const validation = registerSchema.safeParse(data);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            Object.entries(fieldErrors).forEach(([key, messages]) => {
                if (messages && messages.length > 0) {
                    setError(key as keyof RegisterForm, messages[0]);
                }
            });
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Criar uma conta" description="Preencha seus dados abaixo para criar sua conta">
            <Head title="Registrar" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nome completo"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@exemplo.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            tabIndex={3}
                            autoComplete="tel"
                            value={data.phone}
                            onChange={(e) => {
                                // Máscara para telefone brasileiro: +55 (XX) XXXXX-XXXX ou +55 (XX) XXXX-XXXX
                                let value = e.target.value.replace(/\D/g, '');

                                // Remove o código do país se já estiver presente para evitar duplicidade
                                if (value.startsWith('55')) {
                                    value = value.slice(2);
                                }

                                if (value.length > 11) value = value.slice(0, 11);

                                if (value.length > 10) {
                                    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                                } else if (value.length > 6) {
                                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                                } else if (value.length > 2) {
                                    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                                } else {
                                    value = value.replace(/^(\d*)/, '($1');
                                }

                                setData('phone', `+55 ${value}`);
                            }}
                            disabled={processing}
                            placeholder="+55 (99) 99999-9999"
                            maxLength={19}
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Senha"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirm ? 'text' : 'password'}
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirme a senha"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                aria-label={showPasswordConfirm ? 'Esconder senha' : 'Mostrar senha'}
                            >
                                {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Criar conta
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <TextLink href={route('login')} tabIndex={7}>
                        Entrar
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
