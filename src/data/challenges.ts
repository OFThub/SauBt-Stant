// Kod meydan okuması soruları. Oyuncu önce dili seçer, o dilden rastgele CHALLENGE_COUNT soru gelir.
// kind 'bug': "Hata hangi satırda?" · kind 'output': "Ekrana ne yazdırır?" · prompt verilirse onun yerine geçer.
// answer: options içindeki doğru cevabın sırası (0'dan başlar).
// Her dilde en az 12 soru olmalı; npm test bunu ve cevap aralıklarını denetler.
// Yeni soru eklerken cevabı mutlaka kodu çalıştırarak doğrula.
export type Challenge = {
  kind: 'bug' | 'output'
  lang: string
  code: string
  options: string[]
  answer: number
  explain: string
  prompt?: string
}

const LINES = ['1. satır', '2. satır', '3. satır', 'Hata yok']
const LINES4 = ['1. satır', '2. satır', '3. satır', '4. satır']
const LINES2 = ['1. satır', '2. satır', 'Hata yok', 'Sadece çalışma anında']

export const CHALLENGES: Challenge[] = [
  // ── Python ──────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Python',
    code: `x = [1, 2, 3]
y = x
y.append(4)
print(len(x))`,
    options: ['3', '4', 'Hata', 'None'],
    answer: 1,
    explain: 'y = x kopya oluşturmaz; ikisi de aynı listeyi gösterir.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `a = "Sakarya"
print(a[-1] + a[0])`,
    options: ['aS', 'Sa', 'ya', 'Hata'],
    answer: 0,
    explain: 'a[-1] son karakter (a), a[0] ilk karakter (S).',
  },
  {
    kind: 'bug',
    lang: 'Python',
    code: `def ortalama(liste):
    toplam = 0
    for x in liste:
        toplam += x
    return toplam / len(liste)

print(ortalama([]))`,
    options: ['2. satır', '4. satır', '5. satır', 'Hata yok'],
    answer: 2,
    explain: 'Boş listede len(liste) 0 olur: ZeroDivisionError.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `def ekle(x, liste=[]):
    liste.append(x)
    return liste

ekle(1)
print(ekle(2))`,
    options: ['[2]', '[1, 2]', '[2, 1]', 'Hata'],
    answer: 1,
    explain: 'Varsayılan liste bir kez oluşturulur ve tüm çağrılar onu paylaşır.',
  },
  {
    kind: 'bug',
    lang: 'Python',
    code: `sayi = input("Sayı gir: ")
if sayi > 10:
    print("Büyük")`,
    options: LINES,
    answer: 1,
    explain: 'input() metin döndürür; metin ile sayı karşılaştırılamaz. int(sayi) gerekir.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `print("ab" * 3)`,
    options: ['ababab', 'ab3', 'Hata', 'aabbcc'],
    answer: 0,
    explain: 'Metni bir tam sayıyla çarpmak onu o kadar tekrar eder.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `print(round(2.5), round(3.5))`,
    options: ['3 4', '2 4', '2 3', '3 3'],
    answer: 1,
    explain: 'Python .5 değerlerini en yakın çift sayıya yuvarlar: 2.5 → 2, 3.5 → 4.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `a = [1, 2, 3]
print(a[1:] + a[:1])`,
    options: ['[2, 3, 1]', '[1, 2, 3]', '[2, 3]', '[3, 1, 2]'],
    answer: 0,
    explain: 'a[1:] ilk eleman hariç hepsi, a[:1] sadece ilk eleman: listeyi bir sola döndürür.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `print(-7 // 2)`,
    options: ['-3', '-4', '-3.5', 'Hata'],
    answer: 1,
    explain: '// aşağı yuvarlar: -3.5 → -4. Sıfıra doğru kesmez.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `s = {1, 2, 2, 3}
print(len(s))`,
    options: ['4', '3', '2', 'Hata'],
    answer: 1,
    explain: 'Küme (set) tekrar eden elemanları bir kez tutar.',
  },
  {
    kind: 'bug',
    lang: 'Python',
    code: `x = 10
def f():
    x += 1
f()`,
    options: LINES4,
    answer: 2,
    explain: 'Fonksiyon içinde x\'e atama yapılınca x yerel sayılır; okunmadan önce artırılamaz: UnboundLocalError.',
  },
  {
    kind: 'output',
    lang: 'Python',
    code: `print(bool("False"))`,
    options: ['True', 'False', 'Hata', 'None'],
    answer: 0,
    explain: 'Boş olmayan her metin doğrudur; içinde "False" yazması fark etmez.',
  },

  // ── JavaScript ──────────────────────────────────────────
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log(0.1 + 0.2 === 0.3)`,
    options: ['true', 'false', 'undefined', 'NaN'],
    answer: 1,
    explain: 'Ondalık sayılar ikili tabanda tam tutulamaz: 0.1 + 0.2 = 0.30000000000000004.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log("5" + 3)
console.log("5" - 3)`,
    options: ['8 ve 2', '53 ve 2', '53 ve 53', 'Hata'],
    answer: 1,
    explain: '+ metinleri birleştirir, - ise metni sayıya çevirir.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `const sayilar = [10, 1, 5];
sayilar.sort();
console.log(sayilar);`,
    options: ['[1, 5, 10]', '[1, 10, 5]', '[10, 5, 1]', '[10, 1, 5]'],
    answer: 1,
    explain: 'sort() varsayılan olarak metin gibi sıralar. Sayılar için sort((a, b) => a - b).',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i))
}`,
    options: ['0 1 2', '3 3 3', '0 0 0', '1 2 3'],
    answer: 1,
    explain: 'var döngüye özel değildir; zamanlayıcılar çalıştığında i zaten 3. let ile 0 1 2 yazar.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log(typeof null)`,
    options: ['null', 'object', 'undefined', 'Hata'],
    answer: 1,
    explain: "JavaScript'in ilk sürümünden kalan, bilinen bir tarihî hata.",
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log([1, 2, 3] + [4, 5])`,
    options: ['[1, 2, 3, 4, 5]', '1,2,34,5', 'NaN', 'Hata'],
    answer: 1,
    explain: '+ dizileri önce metne çevirir: "1,2,3" + "4,5".',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log(typeof NaN)`,
    options: ['NaN', 'number', 'undefined', 'object'],
    answer: 1,
    explain: 'NaN ("sayı değil") teknik olarak number tipindedir.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log([10, 1, 3].map(parseInt))`,
    options: ['[10, 1, 3]', '[10, NaN, NaN]', '[NaN, NaN, NaN]', 'Hata'],
    answer: 1,
    explain: 'map sıra numarasını da verir: parseInt("1", 1) ve parseInt("3", 2) geçersiz tabandır.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `const a = { x: 1 }
const b = a
b.x = 2
console.log(a.x)`,
    options: ['1', '2', 'undefined', 'Hata'],
    answer: 1,
    explain: 'Nesneler referansla atanır; a ve b aynı nesneyi gösterir.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `console.log(null == undefined, null === undefined)`,
    options: ['true true', 'true false', 'false false', 'false true'],
    answer: 1,
    explain: '== tip dönüşümüyle ikisini eşit sayar; === tipleri de karşılaştırır.',
  },
  {
    kind: 'output',
    lang: 'JavaScript',
    code: `let x = 1
{
  let x = 2
}
console.log(x)`,
    options: ['1', '2', 'undefined', 'Hata'],
    answer: 0,
    explain: 'let blok kapsamlıdır; içerideki x ayrı bir değişkendir.',
  },
  {
    kind: 'bug',
    lang: 'JavaScript',
    code: `const sayi = 5
sayi = 10
console.log(sayi)`,
    options: LINES,
    answer: 1,
    explain: 'const ile tanımlanan değişkene yeniden atama yapılamaz: TypeError.',
  },

  // ── TypeScript ──────────────────────────────────────────
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `function topla(a: number, b: number) {
  return a + b
}
const sonuc: string = topla(2, 3)`,
    options: ['1. satır', '2. satır', '4. satır', 'Hata yok'],
    answer: 2,
    explain: 'topla number döndürür; string tipli bir değişkene atanamaz.',
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `enum Renk { Kirmizi, Yesil = 5, Mavi }
console.log(Renk.Mavi)`,
    options: ['2', '3', '6', 'Mavi'],
    answer: 2,
    explain: 'Enum değerleri bir öncekinden devam eder: Yesil 5 ise Mavi 6.',
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `type Kisi = { ad: string }
const o = { ad: "Ali", yas: 20 }
const k: Kisi = o
console.log(Object.keys(k).length)`,
    options: ['1', '2', 'Derleme hatası', 'undefined'],
    answer: 1,
    explain: 'Tipler çalışma anında silinir; k hâlâ iki alanlı aynı nesnedir. Fazla alan sadece doğrudan nesne yazımında hata verir.',
  },
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `let deger: unknown = "merhaba"
console.log(deger.length)`,
    options: LINES2,
    answer: 1,
    explain: 'unknown tipli bir değer kullanılmadan önce daraltılmalı (typeof kontrolü gibi).',
  },
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `interface Kedi { ad: string; yas: number }
const k: Kedi = { ad: "Tekir" }`,
    options: LINES2,
    answer: 1,
    explain: "Kedi tipinde yas zorunlu; nesnede eksik.",
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `function f(x?: number) {
  return x ?? 10
}
console.log(f(0), f())`,
    options: ['10 10', '0 10', '0 undefined', 'Hata'],
    answer: 1,
    explain: '?? sadece null ve undefined için devreye girer; 0 geçerli bir değerdir.',
  },
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `type Durum = "acik" | "kapali"
let d: Durum = "acik"
d = "beklemede"`,
    options: LINES,
    answer: 2,
    explain: 'Durum sadece "acik" veya "kapali" olabilir.',
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `class Sayac {
  static adet = 0
  constructor() { Sayac.adet++ }
}
new Sayac(); new Sayac()
console.log(Sayac.adet)`,
    options: ['0', '1', '2', 'Hata'],
    answer: 2,
    explain: 'static alan sınıfa aittir; tüm nesneler aynı sayacı artırır.',
  },
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `function selam(ad: string): string {
  if (ad) {
    return "Merhaba " + ad
  }
}`,
    options: ['1. satır', '3. satır', '5. satır', 'Hata yok'],
    answer: 0,
    explain: 'ad boşsa fonksiyon hiçbir şey döndürmez; dönüş tipi string olduğu için derleyici 1. satırdaki imzaya itiraz eder.',
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `const tuple: [string, number] = ["yas", 20]
const [, n] = tuple
console.log(n + 1)`,
    options: ['21', 'yas1', '201', 'Hata'],
    answer: 0,
    explain: 'Virgülle ilk eleman atlanır; n = 20.',
  },
  {
    kind: 'bug',
    lang: 'TypeScript',
    code: `const x = 5
x.toUpperCase()`,
    options: LINES2,
    answer: 1,
    explain: 'x bir sayıdır; sayılarda toUpperCase yoktur.',
  },
  {
    kind: 'output',
    lang: 'TypeScript',
    code: `const sayi = "5" as unknown as number
console.log(sayi + 1)`,
    options: ['6', '51', 'Derleme hatası', 'NaN'],
    answer: 1,
    explain: '"as" sadece derleyiciyi ikna eder, değeri dönüştürmez; çalışırken hâlâ "5" metnidir.',
  },

  // ── Java ────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Java',
    code: `String a = "sau";
String b = new String("sau");
System.out.println(a == b);`,
    options: ['true', 'false', 'sau', 'Derleme hatası'],
    answer: 1,
    explain: '== referansları karşılaştırır. İçerik için a.equals(b) kullanılır.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `int x = 5;
System.out.println(x++ + ++x);`,
    options: ['10', '11', '12', '13'],
    answer: 2,
    explain: "x++ önce 5'i verir (x 6 olur), ++x x'i 7 yapıp verir: 5 + 7 = 12.",
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `System.out.println(1 + 2 + "3" + 4 + 5);`,
    options: ['15', '3345', '12345', '339'],
    answer: 1,
    explain: 'Soldan sağa: 1 + 2 = 3, sonra metin birleşir: "33" + 4 + 5.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println((a == b) + " " + (c == d));`,
    options: ['true true', 'true false', 'false false', 'false true'],
    answer: 1,
    explain: 'Java -128 ile 127 arasındaki Integer nesnelerini önbellekte tutar; 128 için iki ayrı nesne oluşur.',
  },
  {
    kind: 'bug',
    lang: 'Java',
    code: `String s = null;
if (s.equals("sau")) {
    System.out.println("Merhaba");
}`,
    options: LINES,
    answer: 1,
    explain: 'null üzerinde metot çağrılamaz: NullPointerException. "sau".equals(s) güvenlidir.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `System.out.println('a' + 1);`,
    options: ['b', '98', 'a1', 'Hata'],
    answer: 1,
    explain: "char sayıya dönüşür: 'a' = 97, 97 + 1 = 98.",
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `System.out.println(10 / 3 * 3);`,
    options: ['10', '9', '9.99', 'Hata'],
    answer: 1,
    explain: '10 / 3 tam sayı bölmesi: 3. Sonra 3 * 3 = 9.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `String s = "Sakarya";
System.out.println(s.substring(2, 5));`,
    options: ['aka', 'kar', 'kary', 'akar'],
    answer: 1,
    explain: "substring(2, 5) 2. indeksten başlar, 5'i dahil etmez: k, a, r.",
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `int[] a = {1, 2, 3};
int[] b = a;
b[0] = 9;
System.out.println(a[0]);`,
    options: ['1', '9', '0', 'Hata'],
    answer: 1,
    explain: 'Diziler referansla atanır; a ve b aynı diziyi gösterir.',
  },
  {
    kind: 'bug',
    lang: 'Java',
    code: `final int x = 5;
x = 6;`,
    options: LINES2,
    answer: 1,
    explain: 'final değişkene ikinci kez değer atanamaz; derleme hatası.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `System.out.println(Math.round(-2.5));`,
    options: ['-3', '-2', '-2.5', 'Hata'],
    answer: 1,
    explain: 'Math.round yarımları yukarı (artı sonsuza) yuvarlar: -2.5 → -2.',
  },
  {
    kind: 'output',
    lang: 'Java',
    code: `String a = "sau";
String b = "sa" + "u";
System.out.println(a == b);`,
    options: ['true', 'false', 'sau', 'Derleme hatası'],
    answer: 0,
    explain: 'Sabit metinler derleme anında birleşir ve aynı havuz nesnesini gösterir. new String olsaydı false olurdu.',
  },

  // ── C ───────────────────────────────────────────────────
  {
    kind: 'bug',
    lang: 'C',
    code: `int a[5];
for (int i = 0; i <= 5; i++) {
    a[i] = i * 2;
}`,
    options: LINES,
    answer: 1,
    explain: 'i = 5 olduğunda dizinin dışına yazılır. Koşul i < 5 olmalı.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `int x = 7 / 2;
printf("%d", x);`,
    options: ['3.5', '3', '4', 'Hata'],
    answer: 1,
    explain: 'İki tam sayının bölümü tam sayıdır; ondalık kısım atılır.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `printf("%zu", sizeof(char));`,
    options: ['1', '2', '4', '8'],
    answer: 0,
    explain: 'C standardı sizeof(char) değerini her zaman 1 olarak tanımlar.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `char s[] = "SAU";
printf("%zu", sizeof(s));`,
    options: ['3', '4', '8', 'Hata'],
    answer: 1,
    explain: "Metnin sonunda görünmeyen bir '\\0' karakteri var: 3 harf + 1.",
  },
  {
    kind: 'bug',
    lang: 'C',
    code: `int x = 5;
if (x = 0) {
    printf("sıfır");
}`,
    options: LINES,
    answer: 1,
    explain: '= atamadır, karşılaştırma için == gerekir. Koşul hep yanlış olur ve x sıfırlanır.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `printf("%d", -7 / 2);`,
    options: ['-3', '-4', '-3.5', 'Hata'],
    answer: 0,
    explain: "C'de tam sayı bölmesi sıfıra doğru keser.",
  },
  {
    kind: 'output',
    lang: 'C',
    code: `char c = 'A' + 2;
printf("%c", c);`,
    options: ['A2', 'C', '67', 'Hata'],
    answer: 1,
    explain: "char bir sayıdır: 'A' (65) + 2 = 67, yani 'C'.",
  },
  {
    kind: 'output',
    lang: 'C',
    code: `int x = 5;
int *p = &x;
*p = 8;
printf("%d", x);`,
    options: ['5', '8', 'Bir adres', 'Hata'],
    answer: 1,
    explain: "p, x'in adresini tutar; *p'ye yazmak x'e yazmaktır.",
  },
  {
    kind: 'output',
    lang: 'C',
    code: `int a[] = {10, 20, 30};
printf("%d", *(a + 1));`,
    options: ['10', '11', '20', 'Hata'],
    answer: 2,
    explain: '*(a + 1), a[1] ile aynı şeydir.',
  },
  {
    kind: 'bug',
    lang: 'C',
    code: `char *s = "sau";
s[0] = 'S';
printf("%s", s);`,
    options: LINES,
    answer: 1,
    explain: 'Metin sabitleri salt okunur bellekte durur; değiştirmek tanımsız davranıştır (genelde segfault). char s[] = "sau" olmalı.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `printf("%d", 1 << 4);`,
    options: ['5', '14', '16', '4'],
    answer: 2,
    explain: '1 << 4, 1\'i dört bit sola kaydırır: 2⁴ = 16.',
  },
  {
    kind: 'output',
    lang: 'C',
    code: `unsigned int x = 0;
x = x - 1;
printf("%u", x > 0);`,
    options: ['0', '1', '-1', 'Hata'],
    answer: 1,
    explain: 'İşaretsiz sayı 0\'dan geri gidince en büyük değere sarar; sonuç pozitiftir.',
  },

  // ── C++ ─────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'C++',
    code: `int x = 10;
int& r = x;
r = 20;
std::cout << x;`,
    options: ['10', '20', 'Hata', 'Bir adres'],
    answer: 1,
    explain: "r, x'in takma adıdır (referans); r'yi değiştirmek x'i değiştirir.",
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::string s = "abc";
std::cout << s.length() + s[0];`,
    options: ['abc3', '4', '100', 'a3'],
    answer: 2,
    explain: "s[0] bir char'dır ('a' = 97); toplama sayısal yapılır: 3 + 97 = 100.",
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::cout << 5 / 2 * 2.0;`,
    options: ['5', '4', '4.0', '5.0'],
    answer: 1,
    explain: 'Önce 5 / 2 tam sayı bölmesi: 2. Sonra 2 * 2.0 = 4.0; cout bunu 4 diye yazar.',
  },
  {
    kind: 'bug',
    lang: 'C++',
    code: `int* p = new int[10];
p[0] = 42;
delete p;`,
    options: LINES,
    answer: 2,
    explain: 'new[] ile ayrılan bellek delete[] ile silinmeli; delete kullanmak tanımsız davranıştır.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::vector<int> v = {1, 2, 3};
v.push_back(4);
std::cout << v.size();`,
    options: ['3', '4', '5', 'Hata'],
    answer: 1,
    explain: 'push_back sona bir eleman ekler.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `int a = 5;
auto f = [a]() { return a * 2; };
a = 100;
std::cout << f();`,
    options: ['10', '200', '0', 'Hata'],
    answer: 0,
    explain: '[a] değeri yakalandığı anda kopyalar; sonradan a değişse de lambda 5 ile çalışır.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::cout << sizeof(int8_t) + sizeof(int64_t);`,
    options: ['9', '72', '16', '2'],
    answer: 0,
    explain: 'sizeof bayt sayar: int8_t 1 bayt, int64_t 8 bayt.',
  },
  {
    kind: 'bug',
    lang: 'C++',
    code: `int& f() {
    int x = 5;
    return x;
}`,
    options: LINES,
    answer: 2,
    explain: 'Fonksiyon bitince x yok olur; ona referans döndürmek boşlukta asılı (dangling) referans üretir.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::map<std::string, int> m;
m["a"]++;
std::cout << m["a"] + m.size();`,
    options: ['1', '2', '3', 'Hata'],
    answer: 1,
    explain: 'm["a"] yoksa 0 ile oluşturur; artınca 1 olur. Haritada 1 anahtar var: 1 + 1 = 2.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `int x = 7;
std::cout << (x & 1 ? "tek" : "çift");`,
    options: ['tek', 'çift', '1', 'Hata'],
    answer: 0,
    explain: 'x & 1 en sağdaki biti verir; tek sayılarda 1 olur.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::cout << std::boolalpha << (0.1f == 0.1);`,
    options: ['true', 'false', '1', '0'],
    answer: 1,
    explain: '0.1f (float) ve 0.1 (double) farklı hassasiyette yuvarlanır; eşit değildir.',
  },
  {
    kind: 'output',
    lang: 'C++',
    code: `std::string a = "10", b = "2";
std::cout << (a < b);`,
    options: ['0', '1', 'true', 'Hata'],
    answer: 1,
    explain: 'Metinler sözlük sırasıyla karşılaştırılır: "1" < "2". boolalpha olmadan true 1 yazılır.',
  },

  // ── C# ──────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'C#',
    code: `Console.WriteLine(0.1 + 0.2 == 0.3);`,
    options: ['True', 'False', '0.3', 'Derleme hatası'],
    answer: 1,
    explain: 'double ikili tabanda tutulur; 0.1 + 0.2 tam olarak 0.3 etmez.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `string a = "sau";
string b = "SAU".ToLower();
Console.WriteLine(a == b);`,
    options: ['True', 'False', 'sau', 'Derleme hatası'],
    answer: 0,
    explain: "C#'ta string için == içeriği karşılaştırır; Java'daki gibi referansa bakmaz.",
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `int? x = null;
Console.WriteLine(x ?? 7);`,
    options: ['null', '0', '7', 'Hata'],
    answer: 2,
    explain: '?? soldaki değer null ise sağdakini kullanır.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `var liste = new List<int> { 3, 1, 2 };
var sirali = liste.OrderBy(x => x);
liste.Add(0);
Console.WriteLine(string.Join(",", sirali));`,
    options: ['1,2,3', '0,1,2,3', '3,1,2,0', 'Hata'],
    answer: 1,
    explain: 'LINQ sorguları tembeldir; sıralama ancak sonuç okunurken yapılır, o sırada 0 da listededir.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `Console.WriteLine(7 / 2);`,
    options: ['3.5', '3', '4', 'Hata'],
    answer: 1,
    explain: 'İki int bölünürse sonuç int olur.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `var s = "Sakarya";
Console.WriteLine(s[^1]);`,
    options: ['S', 'a', 'y', 'Hata'],
    answer: 1,
    explain: '^1 sondan birinci eleman demektir (C# 8 ile gelen index operatörü).',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `int[] a = { 1, 2, 3 };
Console.WriteLine(a.Sum() * a.Length);`,
    options: ['6', '9', '18', 'Hata'],
    answer: 2,
    explain: 'Toplam 6, eleman sayısı 3: 6 * 3 = 18.',
  },
  {
    kind: 'bug',
    lang: 'C#',
    code: `string s = null;
Console.WriteLine(s.Length);`,
    options: LINES2,
    answer: 1,
    explain: 'null bir metnin uzunluğu okunamaz: NullReferenceException. s?.Length güvenlidir.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `var t = (ad: "Ali", yas: 20);
Console.WriteLine(t.yas + 1);`,
    options: ['21', 'yas1', '201', 'Hata'],
    answer: 0,
    explain: 'İsimli tuple alanlarına adıyla erişilir.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `var a = new Nokta { X = 1 };
var b = a;
b.X = 5;
Console.WriteLine(a.X);

struct Nokta { public int X; }`,
    options: ['1', '5', '0', 'Hata'],
    answer: 0,
    explain: 'struct değer tipidir; b = a bir kopya oluşturur. class olsaydı 5 yazardı.',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `Console.WriteLine($"{3 + 4}{3}");`,
    options: ['10', '73', '7 3', '{3 + 4}{3}'],
    answer: 1,
    explain: 'Her {} ayrı hesaplanıp metne eklenir: "7" + "3".',
  },
  {
    kind: 'output',
    lang: 'C#',
    code: `int x = int.MaxValue;
x++;
Console.WriteLine(x < 0);`,
    options: ['True', 'False', 'OverflowException', 'Derleme hatası'],
    answer: 0,
    explain: 'Varsayılan olarak taşma kontrol edilmez; en büyük int\'e 1 eklenince en küçük değere sarar.',
  },

  // ── Go ──────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Go',
    code: `s := []int{1, 2, 3}
t := s
t[0] = 9
fmt.Println(s[0])`,
    options: ['1', '9', '0', 'Hata'],
    answer: 1,
    explain: "Dilimler (slice) aynı diziyi paylaşır; t üzerinden yapılan değişiklik s'de de görünür.",
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `for i := 0; i < 3; i++ {
    defer fmt.Print(i)
}`,
    options: ['012', '210', '333', '222'],
    answer: 1,
    explain: 'defer edilen çağrılar fonksiyon biterken, son eklenenden başlayarak çalışır.',
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `fmt.Println(len("ğ"))`,
    options: ['1', '2', '4', 'Hata'],
    answer: 1,
    explain: "len bayt sayar; ğ UTF-8'de 2 bayttır. Karakter sayısı için utf8.RuneCountInString.",
  },
  {
    kind: 'bug',
    lang: 'Go',
    code: `x := 5
var y int
fmt.Println(x)`,
    options: LINES,
    answer: 1,
    explain: 'Go kullanılmayan yerel değişkene izin vermez: "declared and not used: y".',
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `m := map[string]int{"a": 1}
fmt.Println(m["b"])`,
    options: ['0', 'nil', 'Hata', '-1'],
    answer: 0,
    explain: 'Olmayan anahtar, değer tipinin sıfır değerini döndürür; int için 0.',
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `x := 10
p := &x
*p = 20
fmt.Println(x)`,
    options: ['10', '20', 'Bir adres', 'Hata'],
    answer: 1,
    explain: "p, x'in adresini tutar; *p'ye yazmak x'i değiştirir.",
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `s := []int{1, 2, 3, 4, 5}
fmt.Println(s[1:3])`,
    options: ['[2 3]', '[1 2 3]', '[2 3 4]', '[1 2]'],
    answer: 0,
    explain: "s[1:3] 1. indeksten başlar, 3'ü dahil etmez.",
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `a := [3]int{1, 2, 3}
b := a
b[0] = 9
fmt.Println(a[0])`,
    options: ['1', '9', '0', 'Hata'],
    answer: 0,
    explain: 'Dizi (array) değer tipidir ve kopyalanır; dilimden (slice) farkı budur.',
  },
  {
    kind: 'bug',
    lang: 'Go',
    code: `var m map[string]int
m["a"] = 1
fmt.Println(m)`,
    options: LINES,
    answer: 1,
    explain: 'Sıfır değerli map nil\'dir; yazmak panic verir. make(map[string]int) gerekir.',
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `fmt.Println(7 / 2, 7.0 / 2)`,
    options: ['3 3', '3 3.5', '3.5 3.5', 'Hata'],
    answer: 1,
    explain: 'Tam sayı bölmesi 3 verir; sabitlerden biri ondalıklıysa sonuç 3.5 olur.',
  },
  {
    kind: 'bug',
    lang: 'Go',
    code: `s := "sau"
s[0] = 'S'`,
    options: LINES2,
    answer: 1,
    explain: "Go'da metinler değiştirilemez; önce []byte veya []rune'a çevirmek gerekir.",
  },
  {
    kind: 'output',
    lang: 'Go',
    code: `x := 5
switch {
case x > 3:
    fmt.Print("A")
case x > 1:
    fmt.Print("B")
}`,
    options: ['A', 'AB', 'B', 'Hiçbiri'],
    answer: 0,
    explain: "Go'da switch eşleşen ilk durumda durur; devam etmek için fallthrough yazılmalı.",
  },

  // ── Rust ────────────────────────────────────────────────
  {
    kind: 'bug',
    lang: 'Rust',
    code: `let s = String::from("sau");
let t = s;
println!("{}", s);`,
    options: LINES,
    answer: 2,
    explain: "let t = s sahipliği t'ye taşır; s artık kullanılamaz (borrow of moved value).",
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let x = 5;
let x = x * 2;
println!("{}", x);`,
    options: ['5', '10', '25', 'Derleme hatası'],
    answer: 1,
    explain: "Aynı isimle yeni değişken tanımlamak (shadowing) Rust'ta serbesttir.",
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let v = vec![1, 2, 3];
let toplam: i32 = v.iter().map(|x| x * 2).sum();
println!("{}", toplam);`,
    options: ['6', '12', '[2, 4, 6]', 'Derleme hatası'],
    answer: 1,
    explain: 'Her eleman ikiyle çarpılır (2, 4, 6) ve toplanır.',
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `println!("{}", -7 / 2);`,
    options: ['-3', '-4', '-3.5', 'Hata'],
    answer: 0,
    explain: "Rust tam sayı bölmesinde sıfıra doğru keser. Python'da aynı işlem -4 verir.",
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let s = "merhaba";
println!("{}", &s[0..3]);`,
    options: ['mer', 'merh', 'erh', 'Hata'],
    answer: 0,
    explain: "0..3 aralığı 3'ü dahil etmez: m, e, r.",
  },
  {
    kind: 'bug',
    lang: 'Rust',
    code: `let x = 5;
x = 6;
println!("{}", x);`,
    options: LINES,
    answer: 1,
    explain: "Rust'ta değişkenler varsayılan olarak değiştirilemez; let mut x gerekir.",
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let t = (1, "iki", 3.0);
println!("{}", t.1);`,
    options: ['1', 'iki', '3', 'Hata'],
    answer: 1,
    explain: 'Tuple alanları 0\'dan başlayan sırayla okunur; t.1 ikinci alandır.',
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let x: Option<i32> = None;
println!("{}", x.unwrap_or(7));`,
    options: ['None', '0', '7', 'panic'],
    answer: 2,
    explain: 'unwrap_or, değer yoksa verilen yedek değeri döndürür.',
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let a = [1, 2, 3];
let b: Vec<i32> = a.iter().rev().cloned().collect();
println!("{:?}", b);`,
    options: ['[1, 2, 3]', '[3, 2, 1]', '[3]', 'Derleme hatası'],
    answer: 1,
    explain: 'rev() yinelemeyi tersine çevirir, collect() sonucu yeni bir Vec yapar.',
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let n = 255u8;
println!("{}", n.wrapping_add(1));`,
    options: ['256', '0', '255', 'panic'],
    answer: 1,
    explain: 'u8 en fazla 255 tutar; wrapping_add taşınca başa sarar.',
  },
  {
    kind: 'bug',
    lang: 'Rust',
    code: `let mut v = vec![1, 2, 3];
let ilk = &v[0];
v.push(4);
println!("{}", ilk);`,
    options: LINES4,
    answer: 2,
    explain: 'ilk hâlâ kullanılırken v değiştirilemez; push vektörü taşıyabilir ve referans geçersiz kalabilir.',
  },
  {
    kind: 'output',
    lang: 'Rust',
    code: `let x = 5;
let y = if x > 3 { "büyük" } else { "küçük" };
println!("{}", y);`,
    options: ['büyük', 'küçük', '5', 'Derleme hatası'],
    answer: 0,
    explain: "Rust'ta if bir ifadedir ve değer döndürebilir.",
  },

  // ── PHP ─────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'PHP',
    code: `echo "10" + "5";`,
    options: ['105', '15', 'Hata', '10 + 5'],
    answer: 1,
    explain: "+ PHP'de her zaman sayısal toplamadır; metin birleştirmek için . kullanılır.",
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `var_dump("abc" == 0);`,
    options: ['bool(true)', 'bool(false)', 'int(0)', 'Hata'],
    answer: 1,
    explain: "PHP 8'den beri sayısal olmayan metin sayıyla metin olarak karşılaştırılır. PHP 7'de sonuç true idi.",
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `$a = [3 => 'x'];
$a[] = 'y';
echo array_key_last($a);`,
    options: ['0', '1', '3', '4'],
    answer: 3,
    explain: '[] ile eklenen eleman, en büyük tam sayı anahtarın bir fazlasını alır.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `echo 7 <=> 3;`,
    options: ['-1', '0', '1', 'true'],
    answer: 2,
    explain: '<=> (spaceship) soldaki büyükse 1, eşitse 0, küçükse -1 döndürür.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `echo strlen("ğ");`,
    options: ['1', '2', '4', 'Hata'],
    answer: 1,
    explain: 'strlen bayt sayar; ğ UTF-8\'de 2 bayttır. Harf sayısı için mb_strlen.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `$a = "5 elma";
echo (int)$a + 1;`,
    options: ['6', '5 elma1', '1', 'Hata'],
    answer: 0,
    explain: '(int) metnin başındaki sayıyı alır: 5.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `echo 0.1 + 0.2 == 0.3 ? "evet" : "hayır";`,
    options: ['evet', 'hayır', '1', 'Hata'],
    answer: 1,
    explain: 'Kayan noktalı sayılarda 0.1 + 0.2 tam olarak 0.3 etmez.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `$x = null;
echo $x ?? "boş";`,
    options: ['null', 'boş', '(boş satır)', 'Hata'],
    answer: 1,
    explain: '?? soldaki değer null ise sağdakini kullanır.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `$arr = [1, 2, 3];
foreach ($arr as &$v) { $v *= 2; }
echo implode(",", $arr);`,
    options: ['1,2,3', '2,4,6', '2,4,3', 'Hata'],
    answer: 1,
    explain: '&$v elemanın kendisine referanstır; döngüde yapılan değişiklik diziyi günceller.',
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `echo "5" . "5" + 1;`,
    options: ['56', '551', '11', 'Hata'],
    answer: 0,
    explain: "PHP 8'de + işlemi .'dan önce yapılır: \"5\" . (\"5\" + 1) = \"56\".",
  },
  {
    kind: 'bug',
    lang: 'PHP',
    code: `$isim = "Ali";
echo "Merhaba " + $isim;`,
    options: LINES2,
    answer: 1,
    explain: "PHP 8'de sayı olmayan metinlerle + yapılamaz (TypeError). Birleştirme . ile yapılır.",
  },
  {
    kind: 'output',
    lang: 'PHP',
    code: `$s = "abc";
echo $s[-1];`,
    options: ['a', 'c', 'b', 'Hata'],
    answer: 1,
    explain: "PHP 7.1'den beri negatif indeks metnin sonundan sayar.",
  },

  // ── Ruby ────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts 0 ? "evet" : "hayır"`,
    options: ['evet', 'hayır', '0', 'Hata'],
    answer: 0,
    explain: "Ruby'de yalnızca nil ve false yanlıştır; 0 doğru sayılır.",
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts 7 / 2`,
    options: ['3.5', '3', '4', 'Hata'],
    answer: 1,
    explain: 'İki tam sayının bölümü tam sayıdır. 7.0 / 2 yazılsaydı 3.5 olurdu.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `a = "sau"
b = a
b << "!"
puts a`,
    options: ['sau', 'sau!', 'Hata', 'nil'],
    answer: 1,
    explain: '<< metni yerinde değiştirir; a ve b aynı nesneyi gösterdiği için a da etkilenir.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts [1, 2, 3].sum { |x| x * x }`,
    options: ['6', '14', '36', '[1, 4, 9]'],
    answer: 1,
    explain: 'Blok her elemanın karesini alır: 1 + 4 + 9 = 14.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts "sau".upcase.reverse`,
    options: ['SAU', 'UAS', 'uas', 'Hata'],
    answer: 1,
    explain: 'Metotlar soldan sağa zincirlenir: "SAU" → "UAS".',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts [1, 2, 3].map { |x| x * 2 }.inspect`,
    options: ['[1, 2, 3]', '[2, 4, 6]', '12', 'Hata'],
    answer: 1,
    explain: 'map her elemana bloğu uygular ve yeni dizi döndürür.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts 10.fdiv(4)`,
    options: ['2', '2.5', '2.0', 'Hata'],
    answer: 1,
    explain: 'fdiv sonucu her zaman ondalıklı verir.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `a = [3, 1, 2]
a.sort
puts a.inspect`,
    options: ['[1, 2, 3]', '[3, 1, 2]', '[3, 2, 1]', 'nil'],
    answer: 1,
    explain: 'sort yeni bir dizi döndürür, a değişmez. Yerinde sıralamak için sort! kullanılır.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts "5" + 5`,
    options: ['10', '55', 'Hata', '5'],
    answer: 2,
    explain: 'Ruby metin ile sayıyı kendiliğinden birleştirmez: TypeError. "5" + 5.to_s gerekir.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts 2 ** 10`,
    options: ['20', '1024', '100', 'Hata'],
    answer: 1,
    explain: '** üs alma operatörüdür: 2¹⁰ = 1024.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `def selam(ad = "dünya")
  "Merhaba #{ad}"
end
puts selam`,
    options: ['Merhaba', 'Merhaba dünya', 'Merhaba #{ad}', 'Hata'],
    answer: 1,
    explain: 'Parametre verilmeyince varsayılan değer kullanılır; parantezsiz çağrı da geçerlidir.',
  },
  {
    kind: 'output',
    lang: 'Ruby',
    code: `puts :sau.object_id == :sau.object_id`,
    options: ['true', 'false', 'nil', 'Hata'],
    answer: 0,
    explain: 'Aynı isimli sembol (symbol) programda tek bir nesnedir.',
  },

  // ── Lua ─────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Lua',
    code: `local t = {"a", "b", "c"}
print(t[1])`,
    options: ['nil', 'a', 'b', 'Hata'],
    answer: 1,
    explain: "Lua'da diziler 1'den başlar.",
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print(10 / 2)`,
    options: ['5', '5.0', '5.00', 'Hata'],
    answer: 1,
    explain: '/ her zaman ondalıklı bölme yapar (Lua 5.3+). Tam sayı bölmesi için // kullanılır.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print("10" + 5)`,
    options: ['105', '15', 'Hata', 'nil'],
    answer: 1,
    explain: 'Lua aritmetikte metni sayıya çevirir. Metin birleştirme operatörü .. dır.',
  },
  {
    kind: 'bug',
    lang: 'Lua',
    code: `local x = 3
if x != 5 then
  print("farklı")
end`,
    options: LINES,
    answer: 1,
    explain: 'Lua\'da "eşit değil" ~= ile yazılır; != sözdizimi hatasıdır.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print(#"merhaba")`,
    options: ['6', '7', '8', 'Hata'],
    answer: 1,
    explain: '# uzunluk operatörüdür.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print(7 // 2)`,
    options: ['3', '3.5', '4', 'Hata'],
    answer: 0,
    explain: '// tam sayı (aşağı yuvarlayan) bölmedir.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print("sau" .. 1 .. 2)`,
    options: ['sau3', 'sau12', 'Hata', 'sau 1 2'],
    answer: 1,
    explain: '.. birleştirme operatörüdür; sayılar metne çevrilip yan yana eklenir.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `local t = {}
t[1] = "a"
t[3] = "c"
print(t[2])`,
    options: ['nil', 'a', 'c', 'Hata'],
    answer: 0,
    explain: 'Olmayan anahtar hata vermez, nil döndürür.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print(0 and "evet" or "hayır")`,
    options: ['evet', 'hayır', '0', 'Hata'],
    answer: 0,
    explain: "Lua'da yalnızca nil ve false yanlıştır; 0 doğru sayılır.",
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `local function f()
  return 1, 2, 3
end
local a, b = f()
print(a + b)`,
    options: ['3', '6', 'Hata', 'nil'],
    answer: 0,
    explain: 'Fonksiyon birden fazla değer döndürebilir; fazlası atılır: a = 1, b = 2.',
  },
  {
    kind: 'output',
    lang: 'Lua',
    code: `print(10 == "10")`,
    options: ['true', 'false', 'Hata', 'nil'],
    answer: 1,
    explain: 'Aritmetik metni sayıya çevirir ama == çevirmez; farklı tipler eşit değildir.',
  },
  {
    kind: 'bug',
    lang: 'Lua',
    code: `local x = 5
x++
print(x)`,
    options: LINES,
    answer: 1,
    explain: "Lua'da ++ yoktur; x = x + 1 yazılır.",
  },

  // ── Haskell ─────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (take 3 [1..])`,
    options: ['[1,2,3]', 'Sonsuz döngü', '[0,1,2]', 'Hata'],
    answer: 0,
    explain: 'Haskell tembeldir; sonsuz listeden sadece ihtiyaç duyulan 3 eleman üretilir.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (div (-7) 2)`,
    options: ['-3', '-4', '-3.5', 'Hata'],
    answer: 1,
    explain: "div aşağı yuvarlar (-3.5 → -4). Sıfıra doğru kesen sürümü quot'tur.",
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (foldr (-) 0 [1, 2, 3])`,
    options: ['-6', '0', '2', '6'],
    answer: 2,
    explain: 'foldr sağdan katlar: 1 - (2 - (3 - 0)) = 2.',
  },
  {
    kind: 'bug',
    lang: 'Haskell',
    code: `main = do
  let x = 5
  x = x + 1
  print x`,
    options: LINES4,
    answer: 2,
    explain: "Haskell'de değişkenler değiştirilemez; do bloğunda x = ... yazmak sözdizimi hatasıdır.",
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (length [1, 3 .. 9])`,
    options: ['5', '9', '4', '3'],
    answer: 0,
    explain: '[1, 3 .. 9] ikişer artar: 1, 3, 5, 7, 9.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (zip [1, 2, 3] "ab")`,
    options: ["[(1,'a'),(2,'b')]", "[(1,'a'),(2,'b'),(3,' ')]", 'Hata', '[1,2,3]'],
    answer: 0,
    explain: 'zip kısa olan listede durur.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (filter even [1 .. 10])`,
    options: ['[2,4,6,8,10]', '[1,3,5,7,9]', '5', '[10]'],
    answer: 0,
    explain: 'filter koşulu sağlayan elemanları tutar.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (head ([] :: [Int]))`,
    options: ['[]', '0', 'Hata', 'Nothing'],
    answer: 2,
    explain: 'Boş listenin ilk elemanı yoktur; head çalışma anında hata verir.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = putStrLn (show 3 ++ "3")`,
    options: ['6', '33', 'Hata', '3 3'],
    answer: 1,
    explain: 'show 3 sayıyı metne çevirir, ++ metinleri birleştirir.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (map (\\x -> x * x) [1, 2, 3])`,
    options: ['[1,4,9]', '[2,4,6]', '14', 'Hata'],
    answer: 0,
    explain: '\\x -> x * x isimsiz bir fonksiyondur (lambda); her elemanın karesini alır.',
  },
  {
    kind: 'output',
    lang: 'Haskell',
    code: `main = print (sum (takeWhile (< 10) [1 ..]))`,
    options: ['45', '55', 'Sonsuz döngü', '10'],
    answer: 0,
    explain: 'takeWhile koşul bozulunca durur: 1..9 toplamı 45.',
  },
  {
    kind: 'bug',
    lang: 'Haskell',
    code: `topla :: Int -> Int -> Int
topla x y = x + y

main = print (topla 1 "2")`,
    options: ['1. satır', '2. satır', '4. satır', 'Hata yok'],
    answer: 2,
    explain: 'topla iki Int bekler; "2" bir metindir. Tip hatası.',
  },

  // ── SQL ─────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `CREATE TABLE t (x INT);
INSERT INTO t VALUES (1), (NULL), (3);
SELECT COUNT(x) FROM t;`,
    options: ['3', '2', 'NULL', 'Hata'],
    answer: 1,
    explain: 'COUNT(sütun) NULL değerleri saymaz; COUNT(*) olsaydı 3 olurdu.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `SELECT NULL = NULL;`,
    options: ['TRUE', 'FALSE', 'NULL', 'Hata'],
    answer: 2,
    explain: 'NULL "bilinmiyor" demektir; iki bilinmeyeni karşılaştırmanın sonucu da bilinmez. IS NULL kullanılır.',
  },
  {
    kind: 'bug',
    lang: 'SQL',
    code: `SELECT bolum, COUNT(*)
FROM ogrenciler
WHERE COUNT(*) > 10
GROUP BY bolum;`,
    options: LINES4,
    answer: 2,
    explain: "Toplama fonksiyonları WHERE'de kullanılamaz; gruplamadan sonra filtre için HAVING gerekir.",
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `-- a.x: 1, 2, 3     b.x: 2, 3, 4
SELECT COUNT(*) FROM a
LEFT JOIN b ON a.x = b.x;`,
    options: ['2', '3', '4', '6'],
    answer: 1,
    explain: 'LEFT JOIN soldaki tablonun tüm satırlarını korur; eşi olmayan 1 de sayılır.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `SELECT COALESCE(NULL, NULL, 'sau', 'x');`,
    options: ['NULL', 'sau', 'x', 'Hata'],
    answer: 1,
    explain: 'COALESCE ilk NULL olmayan değeri döndürür.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `-- t.x: 1, 2, 2, 3, NULL
SELECT COUNT(DISTINCT x) FROM t;`,
    options: ['5', '4', '3', '2'],
    answer: 2,
    explain: 'DISTINCT tekrarları atar, COUNT ise NULL saymaz: 1, 2, 3.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `SELECT 5 BETWEEN 1 AND 5;`,
    options: ['TRUE', 'FALSE', 'NULL', 'Hata'],
    answer: 0,
    explain: 'BETWEEN iki ucu da dahil eder.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `-- t.puan: 10, 20, NULL
SELECT AVG(puan) FROM t;`,
    options: ['10', '15', 'NULL', '30'],
    answer: 1,
    explain: 'AVG NULL değerleri yok sayar: (10 + 20) / 2.',
  },
  {
    kind: 'bug',
    lang: 'SQL',
    code: `SELECT ad, soyad
FROM ogrenciler
ORDER BY yas
WHERE yas > 20;`,
    options: LINES4,
    answer: 3,
    explain: 'WHERE, ORDER BY\'dan önce gelmelidir; sıra: SELECT, FROM, WHERE, GROUP BY, ORDER BY.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu kaç satır döndürür?',
    code: `-- a.x: 1, 2     b.x: 2, 3
SELECT x FROM a
UNION
SELECT x FROM b;`,
    options: ['4', '3', '2', '1'],
    answer: 1,
    explain: 'UNION tekrar eden satırları atar: 1, 2, 3. UNION ALL olsaydı 4 olurdu.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `-- t.x: 1, NULL, 3
SELECT COUNT(*) FROM t WHERE x <> 1;`,
    options: ['1', '2', '3', '0'],
    answer: 0,
    explain: 'NULL <> 1 sonucu da NULL\'dur ve satır elenir; sadece 3 kalır.',
  },
  {
    kind: 'output',
    lang: 'SQL',
    prompt: 'Sorgu ne döndürür?',
    code: `SELECT LENGTH('Sakarya')
     - LENGTH(REPLACE('Sakarya', 'a', ''));`,
    options: ['2', '3', '4', '7'],
    answer: 1,
    explain: "Tüm 'a' harfleri silinince kısalan miktar 'a' sayısını verir.",
  },

  // ── Bash ────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Bash',
    code: `x=5
echo "$x" '$x'`,
    options: ['5 5', '5 $x', '$x $x', 'Hata'],
    answer: 1,
    explain: 'Çift tırnak değişkeni açar, tek tırnak her şeyi olduğu gibi bırakır.',
  },
  {
    kind: 'bug',
    lang: 'Bash',
    code: `isim = "Ali"
echo "Merhaba $isim"`,
    options: ['1. satır', '2. satır', 'Hata yok', 'İkisi de'],
    answer: 0,
    explain: '= etrafında boşluk olunca Bash "isim" adlı bir komut çalıştırmaya çalışır. Doğrusu: isim="Ali".',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `echo $((7 / 2))`,
    options: ['3.5', '3', '4', 'Hata'],
    answer: 1,
    explain: 'Bash aritmetiği yalnızca tam sayılarla çalışır.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `echo {1..5}`,
    options: ['{1..5}', '1 2 3 4 5', '12345', '1..5'],
    answer: 1,
    explain: 'Süslü parantez genişletmesi aralığı tek tek kelimelere açar.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `a=(elma armut kiraz)
echo \${#a[@]}`,
    options: ['1', '3', '15', 'elma'],
    answer: 1,
    explain: '${#dizi[@]} dizinin eleman sayısını verir.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `x=3
if [ $x -gt 2 ]; then echo büyük; else echo küçük; fi`,
    options: ['büyük', 'küçük', '3', 'Hata'],
    answer: 0,
    explain: '-gt "büyüktür" demektir: 3 > 2.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `echo "a b c" | wc -w`,
    options: ['1', '3', '5', 'a b c'],
    answer: 1,
    explain: 'wc -w kelime sayar; | soldaki çıktıyı sağdakine aktarır.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `for i in 1 2 3; do printf "%s-" $i; done`,
    options: ['1-2-3', '1-2-3-', '123', '1 2 3'],
    answer: 1,
    explain: 'printf her turda sayıdan sonra - yazar; sondaki - da dahil.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `s="merhaba"
echo \${s:0:3}`,
    options: ['mer', 'merh', 'aba', 'Hata'],
    answer: 0,
    explain: '${s:başlangıç:uzunluk} metnin bir parçasını alır.',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `false && echo A || echo B`,
    options: ['A', 'B', 'AB', 'Hiçbir şey'],
    answer: 1,
    explain: 'false başarısız olduğu için && sonrası atlanır, || sonrası çalışır.',
  },
  {
    kind: 'bug',
    lang: 'Bash',
    code: `if [$x -eq 5]; then
  echo "beş"
fi`,
    options: LINES,
    answer: 0,
    explain: '[ bir komuttur; etrafında boşluk olmalı: [ $x -eq 5 ].',
  },
  {
    kind: 'output',
    lang: 'Bash',
    code: `echo $(( 2 ** 10 ))`,
    options: ['20', '1024', '100', 'Hata'],
    answer: 1,
    explain: '** üs alma operatörüdür: 2¹⁰ = 1024.',
  },

  // ── Perl ────────────────────────────────────────────────
  {
    kind: 'output',
    lang: 'Perl',
    code: `print "a" x 3;`,
    options: ['aaa', 'a3', '3', 'Hata'],
    answer: 0,
    explain: 'x tekrar operatörüdür: metni 3 kez yazar.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `my @a = (1, 2, 3);
my $n = @a;
print $n;`,
    options: ['1 2 3', '3', '123', '1'],
    answer: 1,
    explain: 'Dizi skaler bir değişkene atanınca eleman sayısını verir.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print "3 elma" + 2;`,
    options: ['3 elma2', '5', 'Hata', '32'],
    answer: 1,
    explain: 'Perl metnin başındaki sayıyı alır (3) ve toplar; uyarılar açıksa ayrıca uyarı verir.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print 10 . 20;`,
    options: ['30', '1020', '10 20', 'Hata'],
    answer: 1,
    explain: '. birleştirme operatörüdür; sayılar metne çevrilip yan yana yazılır.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print "10" == 10.0 ? "evet" : "hayır";`,
    options: ['evet', 'hayır', '1', 'Hata'],
    answer: 0,
    explain: '== sayısal karşılaştırmadır; ikisi de 10 sayılır.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print "abc" eq "ABC" ? 1 : 0;`,
    options: ['1', '0', '(boş)', 'Hata'],
    answer: 1,
    explain: 'eq metinleri büyük/küçük harfe duyarlı karşılaştırır.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `my %h = (a => 1, b => 2);
print scalar(keys %h);`,
    options: ['2', '4', 'ab', '3'],
    answer: 0,
    explain: 'keys skaler bağlamda anahtar sayısını verir.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `my $s = "sakarya";
$s =~ s/a/A/g;
print $s;`,
    options: ['sAkAryA', 'SAKARYA', 'sAkarya', 'Sakarya'],
    answer: 0,
    explain: "s/a/A/g tüm küçük a'ları A yapar; g (global) olmasa sadece ilki değişirdi.",
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print "5" x 2 + 1;`,
    options: ['56', '551', '11', '6'],
    answer: 0,
    explain: 'x, + işleminden önce yapılır: "55" + 1 = 56.',
  },
  {
    kind: 'bug',
    lang: 'Perl',
    code: `use strict;
$x = 5;
print $x;`,
    options: LINES,
    answer: 1,
    explain: 'use strict varken değişkenler my ile tanımlanmalı: my $x = 5.',
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `print 7 / 2;`,
    options: ['3', '3.5', '4', 'Hata'],
    answer: 1,
    explain: "Perl'de / her zaman ondalıklı bölme yapar.",
  },
  {
    kind: 'output',
    lang: 'Perl',
    code: `my @a = (10, 9, 100);
print join(",", sort @a);`,
    options: ['9,10,100', '10,100,9', '100,10,9', 'Hata'],
    answer: 1,
    explain: 'sort varsayılan olarak metin gibi sıralar. Sayısal sıra için sort { $a <=> $b } @a.',
  },
]

export const LANGS = [...new Set(CHALLENGES.map((c) => c.lang))]
